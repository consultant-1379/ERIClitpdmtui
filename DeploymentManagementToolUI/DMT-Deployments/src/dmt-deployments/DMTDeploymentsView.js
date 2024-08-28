define([
    'jscore/core',
    'text!./dMTDeployments.html',
    "styles!./DMTDeployments.less"
], function (core, template,style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getBreadcrumb: function () {
            return this.getElement().find('.ebLayout-Navigation');
        }

    });

});
