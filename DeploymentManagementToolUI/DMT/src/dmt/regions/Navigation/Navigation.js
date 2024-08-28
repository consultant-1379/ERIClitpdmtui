define([
    "jscore/core",
    "./NavigationView",
    "../../widgets/Navigation/NavigationBar"
], function(core, View, NavigationWidget) {

    return core.Region.extend({

        View: View,

        onStart: function() {

            var parent = this.getElement();

            var navigationWidget = new NavigationWidget();
            navigationWidget.attachTo(parent);

//==============================Event Subscribers===========================
            this.getContext().eventBus.subscribe("treeData", function(data) {
                navigationWidget.navBarEvents(data);
            }.bind(this));

            this.getContext().eventBus.subscribe("editProperties", function(data) {
                this.view.disableNavBar();
            }.bind(this));
            
            this.getContext().eventBus.subscribe("propertyInfo", function(options) {
                if(options.type === "Internal Server Error"){
                    this.view.disableNavBar();   
                }
            }.bind(this));

            this.getContext().eventBus.subscribe("cancelEditProperties", function(data) {
                this.view.enableNavBar();
            }.bind(this));

            this.getContext().eventBus.subscribe("itemClicked", function(data) {
                navigationWidget.setNavBarPath(data);
            });

//==============================Event Publishers==============================
            this.view.getNodeProperties(function(e) {
                var value = e.originalEvent.detail.data;
                this.getContext().eventBus.publish("loadNodeProperties", value);
            }.bind(this));

            this.view.openNode(function(e) {
                var value = e.originalEvent.detail.data;
                this.getContext().eventBus.publish("openNode", value);
            }.bind(this));

            this.view.updateTree(function(e) {
                var value = e.originalEvent.detail.data;
                this.getContext().eventBus.publish("updateTree", value);
            }.bind(this));
        }
    });

});