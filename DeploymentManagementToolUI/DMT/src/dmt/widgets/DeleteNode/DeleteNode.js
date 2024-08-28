define([
    'jscore/core',
    "./DeleteNodeView",
    "widgets/Button",
    "widgets/Dialog",
    "./../../ext/Notification/Notification",
    "./../../ext/CRUD/CRUD",
    "./../../ext/CRUD/PayloadParser",
    "../Loader/Loader"
], function (core, View, Button, Dialog, NOTIFICATION, CRUD, PAYLOAD_PARSER) {

    var _path, _node, _eventBus, _element;

    var _customEvent = function(element, eventName, eventObj) {
        element.dispatchEvent(new CustomEvent(eventName, {detail: eventObj}));
    };

    var _deleteNode = function() {
        var successNotification = NOTIFICATION.start(_node.name+' has been successfully deleted', 'success', 'green', 'tick', true);
        _customEvent(_element, "removeChild", {data: _node, notification: successNotification});
        _eventBus.publish("removeTreeLoader");
    };

    var _deleteNodeError = function() {
        var errorNotification = NOTIFICATION.start('Not Allowed to delete '+_node.name, 'error', 'yellow', 'warning', true);
        _customEvent(_element, "removeChild", {notification: errorNotification});
        _eventBus.publish("removeTreeLoader");
    };

    return core.Widget.extend({

        View: View,

        onViewReady: function(options) {

            var parent = this.getElement();

            _eventBus = options.eventBus;
            _element = this.view.getElement()._getHTMLElement();

            this.buttonWidget = new Button({
                caption: 'Delete item',
                enabled: false
            });

            this.buttonWidget.attachTo(parent);

            this.buttonWidget.addEventHandler("click", function() {

                var defaultDialog = new Dialog({
                    header: 'Delete Object?',
                    content: 'Are you sure you want to permanently delete ' + _node.name + '?',
                    buttons: [
                        {caption: 'DELETE',
                            color: 'darkBlue',
                            action: function () {

                                _eventBus.publish("addTreeLoader");

                                CRUD.delete(_path, _deleteNode, _deleteNodeError);

                                defaultDialog.hide();
                            }},
                        {caption: 'Cancel',
                            action: function () {
                                defaultDialog.hide();
                            }}
                    ],
                    visible: true,
                    type: 'warning'
                });
            }.bind(this));
        },

        activateDeleteButton: function(data) {
            var selfURI = PAYLOAD_PARSER.getResourceLinkByKey(data.node, "self");
            _path = selfURI;
            _node = data.node;
            if(_path) {
                this.enable();
            }

        },

        enable: function(){
            this.buttonWidget.enable();
        },

        disable: function(){
            this.buttonWidget.disable();
        }
    });

});
