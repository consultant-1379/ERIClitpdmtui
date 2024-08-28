define([
    "jscore/core",
    "text!./NavigationBar.html",
    "styles!./NavigationBar.less"
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getNavBarInput: function() {
            return this.getElement().find(".eaDMT-wNavigation-input");
        },

        getNavBarButton: function() {
            return this.getElement().find(".eaDMT-wNavigation-button");
        },

        getNavBarButtonIcon: function() {
            return this.getNavBarButton().find(".eaDMT-wNavigation-button-icon");
        },

        getCancelButton: function() {
            return this.getElement().find(".eaDMT-wNavigation-input-closeIcon");
        },

        setNavBarInput: function(path) {
            this.getNavBarButton().setValue(path);
        },

        /*======================EventHandlers=============================*/

        addInputEventHandler: function(fn) {
            this.getNavBarInput().addEventHandler("input", fn);
        },

        addChangeEventHandler: function(fn) {
            this.getNavBarInput().addEventHandler("change", fn);
        },

        addFocusEventHandler: function(fn) {
            this.getNavBarInput().addEventHandler("focus", fn);
        },

        addBlurEventHandler: function(fn) {
            this.getNavBarInput().addEventHandler("blur", fn);
        },

        addKeydownEventHandler: function(fn) {
            //Todo Should be keyup? - check this
            this.getNavBarInput().addEventHandler("keydown", fn);
        },

        addClickHandler: function(fn) {
            this.getNavBarButton().addEventHandler("click", fn);
        },

        addCancelClickHandler: function(fn) {
            this.getCancelButton().addEventHandler("click", fn);
        },

        disableNavBar: function () {
            this.getNavBarInput().setProperty("disabled", true);
            this.disableNavBarButton();
        },

        enableNavBar: function () {
            this.getNavBarInput().setProperty("disabled", false);
            this.enableNavBarButton();
        },

        disableNavBarButton: function () {
            this.getNavBarButton().setProperty("disabled", true);
        },

        enableNavBarButton: function () {
            this.getNavBarButton().setProperty("disabled", false);
        }
    });

});