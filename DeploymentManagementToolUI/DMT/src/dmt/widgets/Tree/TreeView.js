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

        getSVG: function() {
            return this.getElement().find(".eaDMT-wTree-svg");
        },

        //Todo children[1] should be changed to find(class)
        fadeTreeSvg: function() {
            this.getElement().element.children[1].style.opacity = "0.4";
        },
        unfadeTreeSvg: function () {
            this.getElement().element.children[1].style.opacity = "1";
        }

    });

});

