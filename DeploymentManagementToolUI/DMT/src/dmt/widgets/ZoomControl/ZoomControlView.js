define([
    "jscore/core",
    "text!./ZoomControl.html",
    "styles!./ZoomControl.less"
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getPlusBtn: function() {
            return this.getElement().find(".eaDMT-wZoomControl-zoomIn-button");
        },

        getMinusBtn: function() {
            return this.getElement().find(".eaDMT-wZoomControl-zoomOut-button");
        },

        getZoomSlider: function() {
            return this.getElement().find(".eaDMT-wZoomControl-slider");
        },

        getZoomSliderSVG: function() {
            return this.getElement().find(".eaDMT-wZoomControl-svgSlider");
        }
    });

});

