define([
    'jscore/core',
    "jscore/ext/mvp",
    "jscore/ext/net",
    "./TableView",
    "widgets/Table",
    "../../ext/CRUD/CRUD",
    "../../ext/Storage/Writer"

], function(core, mvp, net,View, Table, CRUD, STORE) {

    var _eventBus, workCopiesObj = [];

    /**
     * Some description here...
     * @param workingCopies - objects
     * @private
     */
    var _addWorkingCopyToLocalStorage = function(workingCopies){
        STORE.addWorkingCopiesToDB(workingCopies);
    };

    var _populateCollection = function(workingCopies, output) {
        workingCopies.forEach(function (workingCopy) {
            CRUD.get(workingCopy.links.self, function(wc){
                var model = new mvp.Model({
                    name: wc.name,
                    description: wc.description,
                    lastModified: wc.lastModified,
                    id: wc.id,
                    created: wc.created,
                    mode: wc.mode,
                    self: wc.links.self,
                    children: wc.links.children
                });
                output.addModel(model);
                workCopiesObj.push(wc);
            }, null);
        });
    };

    var _fetchTableContent = function(workingCopies) {
        var output = new mvp.Collection();
        if(workingCopies){
            _populateCollection(workingCopies, output);
        }
        return output;
    };

    var _buildTable = function(collection) {
        this.table = new Table({
            selectableRows: true,
            columns: [
                {
                    title: "Name",
                    attribute: "name"
                },
                {
                    title: "Description",
                    attribute: "description"
                },
                {
                    title: "Last Modified",
                    attribute: "lastModified"
                },
                {
                    title: "Mode",
                    attribute: "mode"
                }
            ]
        }, collection);
    };


    var _addFilterEventHandler = function() {
        var input = this.view.getInput();
        input.addEventHandler("keyup", function (e) {
            _filterTable.call(this, input.getProperty("value"));
        }.bind(this));
    };

    var _filterTable = function(pattern) {
        var filtered = this.collection.searchMap(pattern, ["name", "description"]);
        this.table.setData(filtered);
    };

    var _addTableEventHandler = function(parent) {
        this.table.addEventHandler("rowselect", function (row, model, isSelected) {
            if (isSelected) {
                _addWorkingCopyToLocalStorage(workCopiesObj);
                _eventBus.publish("rowselected", model);
            }
        });
    };

    return core.Widget.extend({

        View: View,

        onViewReady: function (options) {

            _eventBus = options.eventBus;

            var parent = this.getElement(),
                workingCopies = options.wc;

            this.collection = _fetchTableContent.call(this, workingCopies);

            _buildTable.call(this, this.collection);

            this.table.attachTo(this.view.getTable());

            _addFilterEventHandler.call(this);

            _addTableEventHandler.call(this, parent);
        }

    });

});