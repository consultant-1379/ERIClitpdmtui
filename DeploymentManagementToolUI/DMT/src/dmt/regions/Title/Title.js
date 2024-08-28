define([
    "jscore/core",
    "./TitleView",
    "../../widgets/LastRefreshed/LastRefreshed"
], function(core, View, LastRefreshedWidget) {

    return core.Region.extend({

        View: View,

        onStart: function() {

            var parent = this.getElement();

            var lastRefreshedWidget = new LastRefreshedWidget();
            lastRefreshedWidget.attachTo(parent);
        }

    });

});