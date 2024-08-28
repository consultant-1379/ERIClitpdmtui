define([
    "jscore/core",
    "./ListItemView"
], function(core, View) {
    return core.Widget.extend({
        View: View,
        init: function(options) {
            this.model = options.model;
        },
        onViewReady: function (options) {
            this.view.disableEdit();
            this.setContent(options.field);
            this.setRegex(options.regex);
        },
        /**
         * Sets the view with the name value pair
         * @param field the name.
         */
        setContent: function(field) {
            this.view.setId(field.key);
            this.view.setValue(field.value);
            if(field.value === null){
                this.view.getPropertyInput().setProperty("placeholder", field.value);
            }
        },
        /**
         * Enable editing of field values, called by subscribing to an edit event
         */
        enableEdit: function (editMode) {
            if(editMode === true){
                this.view.enableEdit(this.model, editMode);
                this.getElement().setModifier("edit");
                this.editEventId = this.view.addPropertyEditClickHandler(function () {
                    this.view.getPropertyInput().removeModifier("hidden");
                    this.view.getPropertyInput().focus();
                    this.view.getValue().setModifier("hidden");
                }.bind(this));
            } else if(editMode === false){
                this.view.enableEdit(this.model, editMode);
                this.getElement().setModifier("edit");
                this.view.getPropertyInput().removeModifier("hidden");
                this.view.getValue().setModifier("hidden");
            }
        },
        /**
         * Disable editing of the fields by subscribing to a cancel edit event
         */
        disableEdit: function(options) {
            var id = this.view.getId().getText(),
                properties = this.model.getAttribute("properties"),
                previousAttr = properties._originalAttributes;
            if(previousAttr){
                properties.set(previousAttr, {silent: true});
            }
            this.view.setValue(properties.getAttribute(id));
            this.view.disableEdit(this.editEventId);
            if(options.editMode === false){
                this.view.getValue().removeModifier("hidden");
            }            
            this.removeLitpErrorMessages();
        },
        /**
         * Set's the input fields REGEX pattern by taking in the value param
         * @param value
         */
        setRegex: function (value) {
            this.view.setRegex(value);
        },
        /**
         * passes the Litp error message to the list item view
         * @param key associated field
         * @param errorMessage  Litp error message
         */
        addLitpErrorMessage: function(key, errorMessage) {
            var id = this.view.getId().getText();
            if(key === id){
                this.view.setLitpErrorMessage(errorMessage);
                this.view.getLitpError().setModifier("visible");
            }
        },
        /**
         *  resets the Litp error message
         */
        removeLitpErrorMessages: function() {
            this.view.setLitpErrorMessage("");
            this.view.getLitpError().removeModifier("visible");
        }
    });
});