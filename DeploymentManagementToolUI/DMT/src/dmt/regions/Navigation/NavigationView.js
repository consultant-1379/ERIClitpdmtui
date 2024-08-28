define([
    "jscore/core",
    "text!./Navigation.html",
    "styles!./Navigation.less"

], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getNodeProperties: function (fn) {
            this.getElement().find(".eaDMT-wNavigation").addEventHandler("getNodeProperties", fn);
        },

        openNode: function (fn) {
            this.getElement().find(".eaDMT-wNavigation").addEventHandler("openNode", fn);
        },

        updateTree: function (fn) {
            this.getElement().find(".eaDMT-wNavigation").addEventHandler("updateTree", fn);
        },

        disableNavBar: function () {
            this.getElement().find(".eaDMT-wNavigation-input").setProperty("disabled", true);
            this.disableNavBarButton();
        },

        enableNavBar: function () {
            this.getElement().find(".eaDMT-wNavigation-input").setProperty("disabled", false);
            this.enableNavBarButton();
        },

        disableNavBarButton: function () {
            this.getElement().find(".eaDMT-wNavigation-button").setProperty("disabled", true);
        },

        enableNavBarButton: function () {
            this.getElement().find(".eaDMT-wNavigation-button").setProperty("disabled", false);
        }

    });
});