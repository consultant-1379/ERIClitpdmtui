define([
    "jscore/core",
    "text!./RepositionTree.html",
    "styles!./RepositionTree.less"
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

