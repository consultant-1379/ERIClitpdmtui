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

        /**
         *  Adds the 'edit' event handler to the PropertyHeader widget
         * @param fn the function that is to be used by the handler for this event
         */
        addEditClickHandler: function(fn) {
            this.editEventId = this.getElement().find(".eaDMT-wPropertyHeader-editNode").addEventHandler("click", fn);
        },

        /**
         *  Adds the 'cancel' event handler to the PropertyHeader widget
         * @param fn the function that is to be used by the handler for this event
         */
        cancelClickHandler: function(fn) {
            this.getCancelButton().addEventHandler("click", fn);
        },

        addCommitClickHandler: function (fn) {
            this.getCommitButton().addEventHandler("click", fn);
        },

        disableCommitButton: function () {
            this.getCommitButton().setProperty("disabled",true);
        },

        getCommitButton: function () {
            return this.getElement().find(".eaDMT-rProperties-wProperties-commit-button");
        },

        getCancelButton: function () {
            return this.getElement().find(".eaDMT-rProperties-wProperties-cancelEdit");
        }
    });
});