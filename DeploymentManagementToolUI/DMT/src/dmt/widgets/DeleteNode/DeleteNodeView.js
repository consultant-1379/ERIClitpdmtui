define([
    "jscore/core",
    "text!./DeleteNode.html",
    "styles!./DeleteNode.less"
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