define([
    "jscore/core",
    "text!./ControlPanel.html",
    "styles!./ControlPanel.less"

], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        addRepositionTreeClickHandler: function(fn) {
            this.getElement().find(".eaDMT-wRepositionTree-button").addEventHandler("click", fn);
        },

        addZoomInClickHandler: function(fn){
            this.getElement().find(".eaDMT-wZoomControl-zoomIn-button").addEventHandler("mousedown", fn);
        },

        addZoomOutClickHandler: function(fn){
            this.getElement().find(".eaDMT-wZoomControl-zoomOut-button").addEventHandler("mousedown", fn);
        },

        addZoomSliderEventHandler: function(fn){
            this.getElement().find(".eaDMT-wZoomControl-slider").addEventHandler("change", fn);
        },
		
		getInfoPopup: function() {
			return this.getElement().find(".eaDMT-rControlPanel-infoPopup");
		}

    });
});