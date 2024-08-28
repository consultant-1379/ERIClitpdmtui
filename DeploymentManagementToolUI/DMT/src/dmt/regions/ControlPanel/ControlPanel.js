define([
    "jscore/core",
    "./ControlPanelView",
    "../../widgets/RepositionTree/RepositionTree",
    "../../widgets/ZoomControl/ZoomControl",
    "../../widgets/InfoPopup/InfoPopupWrapper"
], function(core, View, RepositionTreeWidget, ZoomControlWidget, InfoPopup) {
    /**
     * Checks if the browser supports range slider
     * @type {_checkIfSupportsRangeSlider}
     * @private
     * @returns boolean
     */
    var _checkIfSupportsRangeSlider = function() {
        //This returns true if the browser supports input type range and false if it doesn't
        var supportsRange = true;
        var i = document.createElement("input");
        i.setAttribute("type", "range");
        if(i.type==="text"){
            supportsRange = false;
        }
        return supportsRange;
    }();

    return core.Region.extend({

        View: View,

        onStart: function() {

            var parent = this.getElement();

            //Instantiate Widget with obj {rangeSupport:Boolean}
            var zoomControlWidget = new ZoomControlWidget({
                rangeSupport: _checkIfSupportsRangeSlider
            });
            zoomControlWidget.attachTo(parent);

            var repositionTreeWidget = new RepositionTreeWidget();
            repositionTreeWidget.attachTo(parent);

            var infoPopupWrapper = new InfoPopup();
            infoPopupWrapper.attachTo(this.view.getInfoPopup());

            this.view.addRepositionTreeClickHandler(function() {
                this.getContext().eventBus.publish("repositionTree");
            }.bind(this));

            this.getContext().eventBus.subscribe("treeZoom", function(data) {
                zoomControlWidget.zoomLevelIndicator(data);
            }.bind(this));

            this.view.addZoomInClickHandler(function(){
                this.getContext().eventBus.publish("treeZoomIn");
            }.bind(this));

            this.view.addZoomOutClickHandler(function(){
                this.getContext().eventBus.publish("treeZoomOut");
            }.bind(this));

            this.view.addZoomSliderEventHandler(function(e){
                var value = e.originalEvent.currentTarget.value;
                this.getContext().eventBus.publish("treeZoomSlider", value);
            }.bind(this));
        }

    });

});