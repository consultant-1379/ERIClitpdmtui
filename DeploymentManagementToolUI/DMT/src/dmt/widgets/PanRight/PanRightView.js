define([
    "jscore/core",
    "text!./PanRight.html",
    "styles!./PanRight.less"
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        }
    });
});