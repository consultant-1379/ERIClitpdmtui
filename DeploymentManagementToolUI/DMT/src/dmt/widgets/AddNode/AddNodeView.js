define([
    "jscore/core",
    "text!./AddNode.html",
    "styles!./AddNode.less"
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