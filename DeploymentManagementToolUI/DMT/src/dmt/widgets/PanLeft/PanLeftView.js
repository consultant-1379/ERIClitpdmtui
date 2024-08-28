define([
    "jscore/core",
    "text!./PanLeft.html",
    "styles!./PanLeft.less"
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

