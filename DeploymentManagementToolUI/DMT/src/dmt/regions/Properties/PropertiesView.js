define([
    "jscore/core",
    "text!./Properties.html",
    "styles!./Properties.less"
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        editMode: function(fn) {
            this.getElement().addEventHandler("editMode", fn);
        },

        cancelEditMode: function(fn) {
            this.getElement().addEventHandler("cancelEditMode", fn);
        },

        addMode: function(fn){
            this.getElement().addEventHandler("addMode", fn);
        },

        cancelAddMode: function(fn) {
            this.getElement().addEventHandler("cancelAddMode", fn);
        },

        addItem: function(fn) {
            this.getElement().addEventHandler("addItem", fn);
        },

        fadeBackground: function() {
            this.getElement().element.style.opacity= "0.6";
        },

        unfadeBackground: function() {
            this.getElement().element.style.opacity= "1";
        }
    });
});