define([
    "jscore/core",
    "text!./Title.html",
    "styles!./Title.less"

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