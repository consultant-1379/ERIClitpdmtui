define([
    'jscore/core',
    "text!./Table.html",
    "styles!./Table.less"

], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getButton: function(){
            return this.getElement().find('.eaDMTDeployments-rTable-loadButton');
        }
    });
});