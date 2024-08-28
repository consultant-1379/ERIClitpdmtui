define([
    "jscore/core",
    "text!./List.html",
    "styles!./List.less"
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