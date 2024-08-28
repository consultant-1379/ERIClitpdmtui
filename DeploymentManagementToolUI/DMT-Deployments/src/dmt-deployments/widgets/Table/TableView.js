define([
    'jscore/core',
    "text!./Table.html",
    "styles!./Table.less"
], function(core, template, styles) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return styles;
        },

        getTable: function() {
            return this.getElement().find('.eaDMTDeployments-wTable-table');
        },

        getInput: function() {
            return this.getElement().find('.eaDMTDeployments-wTable-ebInput');
        }
    });

});