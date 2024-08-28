define([
    'jscore/core',
    "./PropertyInfoView"
], function (core, View) {

    /**
     * Responsible for setting the content of the info panel
     * @param infoType - item properties
     * @private
     */
    var _setContent = function(infoType) {
        if (infoType === "Loading"){
            this.view.setIcon("dialogInfo");
            this.view.setMessage("Loading DMT");
            this.view.setDescription("Please wait...");
        } else if (infoType === "Not Found"){
            this.view.setIcon("warning");
            this.view.setMessage("Element not found");
            this.view.setDescription("Click on a node label to try again. If the problem persists please notify your administrator.");
        } else if (infoType === "Internal Server Error"){
            this.view.setIcon("warning");
            this.view.setMessage("Sorry DMT is experiencing some technical difficulties");
            this.view.setDescription("Try refreshing the page. If the problem persists please notify your administrator.");
        } else {
            this.view.setIcon("dialogInfo");
            this.view.setMessage("You have no element selected");
            this.view.setDescription("Click on a node label to display its properties here.");
        }
    };

    return core.Widget.extend({

        View: View,

        onViewReady: function(options){
            var infoType = options.type;
            _setContent.call(this, infoType);
        }
    });
});