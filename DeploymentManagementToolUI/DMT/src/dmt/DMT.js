define([
    'jscore/core',
    "./DMTView",
    "./regions/ControlPanel/ControlPanel",
    "./regions/Properties/Properties",
    "./regions/Title/Title",
    "./regions/Navigation/Navigation",
    "./regions/Tree/Tree",
    "./regions/CreateDelete/CreateDelete",
    "jscore/ext/locationController"

], function (core, View, ControlRegion, PropertiesRegion, TitleRegion, NavigationRegion, TreeRegion, CreateDeleteRegion, LOC_CONTROL) {

    return core.App.extend({

        View: View,

        init: function() {
            this.workingCopyId = 0;
        },

        onStart: function () {

            var title = new TitleRegion({context: this.getContext()}),
                navigation = new NavigationRegion({context: this.getContext()}),
                control = new ControlRegion({context: this.getContext()}),
                properties = new PropertiesRegion({context: this.getContext(), view: this.getElement()}),
                tree = new TreeRegion({context: this.getContext()}),
                createDelete = new CreateDeleteRegion ({context: this.getContext()});

            /**
             * Location Controller
             */
            var locationController = new LOC_CONTROL({namespace:'dmt'});
            locationController.addLocationListener(function(hash){

                if(hash) this.workingCopyId = hash.split("id=")[1];

                title.start(this.getElement());

                navigation.start(this.getElement());

                control.start(this.getElement());

                properties.start(this.getElement());

                tree.setWorkingCopyId(this.workingCopyId);
                tree.start(this.getElement());

                createDelete.start(this.getElement());

            }.bind(this));

            locationController.start();

            /**
             * Event Subscriptions
             */
            this.getContext().eventBus.subscribe("editProperties", function() {
                this.view.getElement().setModifier("editMode");
            }.bind(this));

            this.getContext().eventBus.subscribe("cancelEditProperties", function() {
                this.view.getElement().removeModifier("editMode");
            }.bind(this));

            this.getContext().eventBus.subscribe("removeChild", function(e) {
                e.notification.attachTo(this.getElement());
            }.bind(this));
        }
    });
});