define([
    "jscore/core",
    "text!./Legend.html",
    "styles!./Legend.less"
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