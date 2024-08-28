define([
    'jscore/core',
    "./TableView",
    "../../widgets/Table/Table",
    "widgets/Button",
    "jscore/ext/locationController"

], function(core, View, TableWidget, Button, LOC_CONTROL) {

    return core.Region.extend({

        View: View,

        onStart: function() {
            var eventBus = this.getContext().eventBus,
                workingCopies = this.options.wc,
                parent = this.getElement();

            var tableWidget = new TableWidget({eventBus: eventBus, wc: workingCopies});
            tableWidget.attachTo(parent);

            this.buttonWidget = new Button({
                caption: 'Load into View',
                enabled: true
            });

            this.buttonWidget.attachTo(this.view.getButton());

            this.locationController = new LOC_CONTROL({namespace:'dmt-deployments'});

            /**
             * Event Subscriptions
             */
            eventBus.subscribe("rowselected", function(model){
                this.buttonWidget.addEventHandler('click', function () {
                    if(model.id){
                        this.locationController.setLocation('dmt?id=' + model.id);
                    }
                }.bind(this));
            }.bind(this));
        }
    });

});