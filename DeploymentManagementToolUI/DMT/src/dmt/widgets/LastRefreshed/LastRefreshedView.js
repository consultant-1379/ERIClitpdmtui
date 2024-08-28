define([
    "jscore/core",
    "text!./LastRefreshed.html",
    "styles!./LastRefreshed.less"
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        /**
         * Sets the element with the current time and date.
         * @param currentTimeAndDate  the current time and date
         */
        setTimeStampElement: function (currentTimeAndDate) {
             this.getElement().find(".eaDMT-wLastRefreshed-date").setText(currentTimeAndDate);
        }

    });

});