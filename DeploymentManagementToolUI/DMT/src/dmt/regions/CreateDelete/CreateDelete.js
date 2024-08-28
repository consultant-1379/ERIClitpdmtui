define([
    'jscore/core',
    "./CreateDeleteView",
    "../../widgets/AddNode/AddNode",
    "../../widgets/DeleteNode/DeleteNode"
], function (core, View, AddNodeWidget, DeleteNodeWidget) {

    return core.Region.extend({

        View: View,
        onStart:function(){
            var parent = this.getElement();
            var eventBus = this.getContext().eventBus;
            this.addNodeWidget = new AddNodeWidget({eventBus: eventBus});
            this.addNodeWidget.attachTo(parent);

            this.deleteNode = new DeleteNodeWidget({"eventBus": eventBus});
            this.deleteNode.attachTo(parent);

            this.startEditMode();
        },

        startEditMode: function () {
            //Event Subscribe

            this.getContext().eventBus.subscribe("itemClicked", function(data) {
                this.deleteNode.activateDeleteButton(data);
                this.addNodeWidget.activateAddSelectBox(data);
                this.addNodeWidget.setOptions(data);
            }.bind(this));

            this.getContext().eventBus.subscribe("editProperties", function() {
                this.addNodeWidget.disable();
                this.deleteNode.disable();
            }.bind(this));

            this.getContext().eventBus.subscribe("cancelEditProperties", function() {
                this.addNodeWidget.enable();
                this.deleteNode.enable();
            }.bind(this));

            //Event Publishers
            this.view.addMode( function (e) {
                var data = e.originalEvent.detail;
                this.getContext().eventBus.publish("addMode",data);
            }.bind(this));

            this.view.removeChild( function (e) {
                var value = e.originalEvent.detail;
                this.getContext().eventBus.publish("removeChild", value);
            }.bind(this));
        }

    });

});

