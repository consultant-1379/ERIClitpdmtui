define([
    "text!./ListItem.html",
    "styles!./ListItem.less",
    "jscore/core"
], function(template,style, core) {
    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getErrorStatus: function() {
            return this.getElement().find(".ebInput-statusError");
        },

        getPropertyInput: function() {
            return this.getElement().find(".eaDMT-wListItem-input");
        },

        getValue: function() {
            return this.getElement().find(".eaDMT-wListItem-value");
        },

        getId: function() {
            return this.getElement().find(".eaDMT-wListItem-name");
        },

        getLitpError: function () {
            return this.getElement().find(".eaDMT-wListItem-errorLitpMessage");
        },

        setLitpErrorMessage: function(errorMessage) {
            this.getLitpError().setText(errorMessage);
        },

        setValidateErrorMessage: function(msg) {
            this.getErrorStatus().setText(msg);
        },

        /**
         * Sets the name element with the name.
         * @param name the name  to be set.
         */
        setId: function (name) {
            this.getId().setText(name);
            this.getValue().setAttribute("data-id",name);
            this.getId().setProperty("title", name);
        },

        /**
         * Sets the value element with the value
         * @param value   the value to be set
         */
        setValue: function (value) {
            this.getValue().setText(value);
            this.getValue().setProperty("title", value);
            this.getPropertyInput().setValue(value);
        },

        /**
         * Apply the REGEX value to the input field
         * @param value
         */
        setRegex: function (value) {
            this.getPropertyInput().setAttribute("pattern",value);
        },

        /**
         * Add click handler to property value field
         * @param fn
         * @returns {String}
         */
        addPropertyEditClickHandler: function(fn) {
            return this.getValue().addEventHandler("click", fn);
        },

        //EDITING Functions
        /**
         * Sets the Edit Elements to hidden
         * @param eventId
         */
        disableEdit: function (eventId) {
            this.getPropertyInput().setModifier("hidden");
            this.getElement().find(".ebInput-status").setStyle("display","none");
            if(eventId){
                this.getValue().removeEventHandler(eventId);
            }
            this.getElement().removeModifier("edit");
            if(this.blurEventId !== undefined && this.keyPressId !== undefined){
                this.getPropertyInput().removeEventHandler(this.blurEventId);
                this.getPropertyInput().removeEventHandler(this.keyPressId);
            }
        },

        /**
         * Enables the editing elements
         * @param model
         */
        enableEdit: function (model, editMode) {
            this.blurEventId = this.getPropertyInput().addEventHandler("blur", function (e){
                var inputValue = this.getPropertyInput().getValue();
                if(editMode === true){
                    this.getPropertyInput().setModifier("hidden");
                    this.getValue().removeModifier("hidden");
                }
                if(inputValue){
                    this.setValue(inputValue);
                }

                var properties = model.getAttribute("properties");
                if(e.originalEvent.currentTarget.checkValidity()){
                    //Set Model Value
                    if(inputValue){
                        properties.set(this.getId().getText(), inputValue);
                    }
                    
                    //Remove error status from Error Object
                    if(model.checkError.getErrorStatus.call(model)){
                        model.checkError.removeErrorObj.call(model, this.getId().getText());
                    }
                }
                else{
                    //Add property key to Error Object
                    model.checkError.addErrorObj.call(model, this.getId().getText());
                }
            }.bind(this));
            this.keyPressId = this.getPropertyInput().addEventHandler("keypress", function (e){
                if (e.originalEvent.keyCode === 13){
                    if(editMode === true){
                        this.getPropertyInput().setModifier("hidden");
                        this.getValue().removeModifier("hidden");
                    }
                    else if(editMode === false){
                        this.getPropertyInput().trigger("blur");
                    }
                }
            }.bind(this));
            this.getPropertyInput().addEventHandler("input", function (e){
                if(e.originalEvent.currentTarget.checkValidity() === false){
                    this.getElement().find(".ebInput-status").setStyle({"display":"block","margin":
                        "0 0 0 45%"});
                    this.setValidateErrorMessage(e.originalEvent.currentTarget.validationMessage);
                } else {
                    this.getElement().find(".ebInput-status").setStyle("display","none");
                }
            }.bind(this));
        }
    });
});