define([
    "jscore/core",
    "text!./Tree.html",
    "styles!./Tree.less"

], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },
        
        getTreeWidget: function() {
            return this.getElement().find(".eaDMT-wTree");  
        },

        addSubmitClickHandler: function(fn) {
            this.getTreeWidget().addEventHandler("clickNodeLabel", fn);
        },

        onTreeLoadHandler: function(fn) {
            this.getTreeWidget().addEventHandler("loadTree", fn);
        },

        addPanRightClickHandler: function(fn) {
            this.getElement().find(".eaDMT-wPanRight-button").addEventHandler("mousedown", fn);
        },

        addPanLeftClickHandler: function(fn) {
            this.getElement().find(".eaDMT-wPanLeft-button").addEventHandler("mousedown", fn);
        }

    });

});