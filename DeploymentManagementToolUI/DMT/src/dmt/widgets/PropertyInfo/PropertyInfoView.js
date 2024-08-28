define([
    "jscore/core",
    "text!./PropertyInfo.html",
    "styles!./PropertyInfo.less"
], function(core, template, style) {

    var nodePropertyObject;

    return core.View.extend({


        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        setDescription: function(description) {
            this.getDescription().setText(description);
        },

        setMessage: function(message) {
            this.getMessage().setText(message);
        },

        setIcon: function(iconName) {
            this.getIcon().setModifier(iconName);
        },

        getDescription: function() {
            return this.getElement().find(".eaDMT-wPropertyInfo-description");
        },

        getMessage: function() {
            return this.getElement().find(".eaDMT-wPropertyInfo-message");
        },

        getIcon: function() {
            return this.getElement().find(".eaDMT-wPropertyInfo-icon > .ebIcon");
        }

    });

});
