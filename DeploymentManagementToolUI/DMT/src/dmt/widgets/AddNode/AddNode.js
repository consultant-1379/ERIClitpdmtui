define([
    'jscore/core',
    "./AddNodeView",
    "widgets/SelectBox",
    "./../../ext/CRUD/CRUD",
    "./../../ext/CRUD/PayloadParser",
    "./../../ext/Nodes/ItemTypeParser"
], function (core, View, SelectBox, CRUD, PAYLOAD_PARSER, PARSER) {

    var _typeName, _selectBox, _options, _data, _eventBus;

    /**
     * Set Items in SelectBox based on GET request
     * @param response
     * @private
     */
    var _setList = function(response){
        _data = response;
        var items = PARSER.getItemsWithName(_data);
        _selectBox.setItems(items);

        //If no item, set selectBox value to 'No Items'
        if(items.length === 0){
            _selectBox.setValue({"name":"No Items"});
        }else{
            _selectBox.setValue({"name":"Add Item"});
        }
    };

    var _loadPropertiesView = function (response) {
        _eventBus.publish("removeLoaderFromPropPanel");
        var propertyFields = PARSER.getFields(response);
        //TODO change this to use the EventBus - remove customEvent
        var event = new CustomEvent("addMode",{"detail":{ "propertiesFields":propertyFields, "path": _options.path, "type":{"name":_typeName}, "payload": response}});
        this.view.getElement()._getHTMLElement().dispatchEvent(event);
    };

    return core.Widget.extend({

        View: View,

        onViewReady: function(options){
            var parent = this.getElement();

            _eventBus = options.eventBus;

            _selectBox = new SelectBox({
                value: {name: 'Add Item', value: 1, title: 'Add Item'}
            });
            _selectBox.attachTo(parent);

            //When user selects an item from the SelectBox a "change" event is triggered
            _selectBox.addEventHandler('change', function() {
                var name = _selectBox.getValue().name;
                _typeName = PARSER.getItemType(_data, name);

                this.setPropertyFields(_typeName);
            }.bind(this));
        },

        /**
         * Enable/Disable AddSelectBox and populate with item_types list
         * @param options
         */
        activateAddSelectBox : function(options) {
            var addableItemsURI = PAYLOAD_PARSER.getResourceLinkByKey(options.properties, "addableChildren");
            CRUD.get(addableItemsURI, _setList.bind(this), function(){
                _selectBox.setValue({"name":"No Items"});
            });
        },

        /**
         * Triggers AddItem event
         * @param typeName
         */
        setPropertyFields : function(typeName) {
            _typeName = typeName;
            var item = PARSER.getItemByName(_data, _typeName);
            var typeURI = PAYLOAD_PARSER.getResourceLinkByKey(item, "self");

            _eventBus.publish("addLoaderInPropPanel");

            CRUD.get(typeURI, _loadPropertiesView.bind(this), _eventBus.publish("removeLoaderFromPropPanel"));
        },

        disable: function() {
            _selectBox.disable();
        },

        enable: function() {
            _selectBox.enable();
        },

        setOptions: function(options) {
            _options = options;
        }
    });
});