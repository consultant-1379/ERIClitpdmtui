define([
    "jscore/core",
    "./TreeView",
    "../../widgets/Tree/Tree",
    "../../widgets/Legend/Legend",
    "../../widgets/PanLeft/PanLeft",
    "../../widgets/PanRight/PanRight"

], function(core, View, TreeWidget, LegendWidget, PanLeftWidget, PanRightWidget) {

    var _workingCopyId = 0;

    return core.Region.extend({

        View: View,

        onStart: function() {

            var parent = this.getElement(),
                eventBus = this.getContext().eventBus,
                workingCopyId = _workingCopyId;

            var treeWidget = new TreeWidget({eventBus: eventBus, wc: _workingCopyId});
            treeWidget.attachTo(parent);

            var legendWidget = new LegendWidget();
            legendWidget.attachTo(parent);

            var panLeftWidget = new PanLeftWidget();
            panLeftWidget.attachTo(parent);

            var panRightWidget = new PanRightWidget();
            panRightWidget.attachTo(parent);

            this.view.addSubmitClickHandler(function(e) {
                //TODO Combine all below as one Event on the EventBus, "item"
                var PATH = e.originalEvent.detail.path,
                    PROPS = e.originalEvent.detail.properties,
                    NODE = e.originalEvent.detail.NODE;

                eventBus.publish("itemClicked", {"properties":PROPS, "node":NODE, "path":PATH});

            }.bind(this));

            this.view.onTreeLoadHandler(function(e) {
                var value = e.originalEvent.detail.data;
                eventBus.publish("treeData", value);
            });

            this.view.addPanRightClickHandler(function() {
                treeWidget.panRight();
            });

            this.view.addPanLeftClickHandler(function() {
                treeWidget.panLeft();
            });

            /**
             * Event Subscriptions
             */
            eventBus.subscribe("addTreeLoader", function() {
                treeWidget.addTreeLoader();
            });

            eventBus.subscribe("removeTreeLoader", function() {
                treeWidget.removeTreeLoader();
            });

            eventBus.subscribe("loadNodeProperties", function(node) {
                treeWidget.treeEvents.labelFn(node);
            });

            eventBus.subscribe("openNode", function(node) {
                treeWidget.expandChildrenNodes(node);
            });

            eventBus.subscribe("repositionTree", function() {
                treeWidget.repositionTree();
            });

            eventBus.subscribe("treeZoomIn", function() {
                treeWidget.zoomIn();
            });

            eventBus.subscribe("treeZoomOut", function() {
                treeWidget.zoomOut();
            });

            eventBus.subscribe("treeZoomSlider", function(value) {
                treeWidget.zoomSlider(value);
            });

            eventBus.subscribe("updateTree", function(source) {
                treeWidget.updateTree(source);
            });

            eventBus.subscribe("removeChild", function(source) {
                treeWidget.removeChild(source.data);
            });

            eventBus.subscribe("addChild", function(id){
                treeWidget.addChild(id);
            });

            eventBus.subscribe("editProperties", function() {
                this.getElement().setModifier("edit");
                treeWidget.disableClickLabel();
            }.bind(this));

            eventBus.subscribe("cancelEditProperties", function() {
                this.getElement().removeModifier("edit");
                treeWidget.enableClickLabel();
            }.bind(this));
        },

        setWorkingCopyId: function(id){
            _workingCopyId = id;
        }
    });
});