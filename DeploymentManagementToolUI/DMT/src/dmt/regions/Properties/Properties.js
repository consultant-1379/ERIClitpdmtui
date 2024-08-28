define([
    "jscore/core",
    "./PropertiesView",
    "./../../ext/Properties/PropertiesUtils",
    "./../../widgets/Property/Properties",
    "./../../widgets/PropertyInfo/PropertyInfo",
    "../../widgets/Loader/Loader"
], function(core, View, UTILS, Properties, Info, Loader) {

    var _propWidget,
        _addPropWidget,
        _infoWidget,
        _editMode = true;
    var _loader = new Loader();

    return core.Region.extend({

        View: View,

        onStart: function () {
            //Todo _parent and regionView duplication? AND applicationView??
            var _parent = this.view.getElement();
            var view = this.view;

            var regionView  = this.view.getElement(),
                applicationView = this._parent,
                eventBus = this.getContext().eventBus,
                node;

            /**
             * EditMode is the default mode for the Properties Panel, it loads the properties as View Only,
             * thereafter editMode can be enabled by click the edit button.
             */
            eventBus.subscribe("itemClicked", function(data) {
                node = data.node;
                _editMode = true;
                this.startEditMode();

                if(_infoWidget) _infoWidget.destroy();
                if(_propWidget) _propWidget.destroy();
                if(_addPropWidget) _addPropWidget.destroy();

                _propWidget = new Properties({
                    data: data,
                    dmtView: applicationView,
                    editMode: _editMode,
                    parent: regionView,
                    eventBus: eventBus,
                    node: node
                });
                _loader.detach();
                view.unfadeBackground();
                _propWidget.attachTo(regionView);
            }.bind(this));

            eventBus.subscribe("addLoaderInPropPanel", function() {
                _loader.attachTo(_parent);
                view.fadeBackground();
            });

            eventBus.subscribe("removeLoaderFromPropPanel", function() {
                _loader.detach();
                view.unfadeBackground();
            });

            /**
             * AddMode is instantiated as soon as a new Item is clicked on to be added.
             */
            eventBus.subscribe("addMode", function(data) {
                _editMode = false;
                this.startAddMode();

                if(_propWidget) _propWidget.detach();
                _addPropWidget = new Properties({
                    data: data,
                    dmtView: applicationView,
                    editMode: _editMode,
                    parent: regionView,
                    eventBus: eventBus,
                    node: node
                });

                _addPropWidget.attachTo(regionView);
            }.bind(this));

            /**
             * PropertyInfo is used display feedback to the user in relation to:
             * Tree Loading,
             * Node Properties,
             * Server-side connection issue
             */
            eventBus.subscribe("propertyInfo", function(data) {

                if(_infoWidget) _infoWidget.destroy();
                if(_propWidget) _propWidget.destroy();

                _infoWidget = new Info(data);
                _infoWidget.attachTo(regionView);
            });
        },

        //TODO Update the names for Publish Events to be more generic, "editProperties" and "cancelEditProperties"
        startEditMode: function () {
            //Event Publishers
            this.view.editMode(function () {
                this.getContext().eventBus.publish("editProperties");
                this.view.getElement().setModifier("editMode");
            }.bind(this));

            this.view.cancelEditMode(function () {
                this.getContext().eventBus.publish("cancelEditProperties");
                this.view.getElement().removeModifier("editMode");
            }.bind(this));
        },
        startAddMode: function () {
            this.view.addMode(function () {
                this.getContext().eventBus.publish("editProperties");
                this.view.getElement().setModifier("addMode");
            }.bind(this));

            this.view.cancelAddMode(function () {
                this.getContext().eventBus.publish("cancelEditProperties");
                this.view.getElement().removeModifier("addMode");
                if(_addPropWidget) _addPropWidget.destroy();
                if(_propWidget) _propWidget.attachTo(this.view.getElement());
            }.bind(this));

            this.view.addItem(function () {
                this.getContext().eventBus.publish("cancelEditProperties");
                this.view.getElement().removeModifier("addMode");
            }.bind(this));
        }
    });
});