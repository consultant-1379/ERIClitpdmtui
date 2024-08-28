define([
    "jscore/core",
    "text!./CreateDelete.html",
    "styles!./CreateDelete.less"

], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },
        addMode: function(fn) {
            this.getElement().find(".eaDMT-wAddNode").addEventHandler("addMode", fn);
        },

        removeChild: function(fn){
            this.getElement().find(".eaDMT-wDeleteNode").addEventHandler("removeChild", fn);
        }
    });
});