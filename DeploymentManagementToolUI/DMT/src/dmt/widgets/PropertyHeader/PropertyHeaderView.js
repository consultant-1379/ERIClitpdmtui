define([
    "jscore/core",
    "text!./PropertyHeader.html",
    "styles!./PropertyHeader.less"
], function(core, template, style) {

    var nodePropertyObject;

    return core.View.extend({


        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        setNodeName: function(nodeName) {
            this.getElement().find(".eaDMT-wPropertyHeader-nodeName").setText(nodeName);
            this.getElement().find(".eaDMT-wPropertyHeader-nodeName").setProperty("title", nodeName);
        },

        setState: function(state) {
            this.getElement().find(".eaDMT-wPropertyHeader-stateValue").setText(state);
        },

        addMode: function() {
            this.getElement().find(".eaDMT-wPropertyHeader");
        },

        getId: function() {
            return this.getElement().find(".eaDMT-wPropertyHeader-input").getValue();
        },

        getStatus: function() {
            return this.getElement().find(".ebInput-status");
        },

        getErrorMessage: function() {
           return this.getElement().find(".eaDMT-wPropertyHeader-errorLitpMessage");
        },

        setErrorMessage: function(value) {
            this.getStatus().setStyle("display","none");
            if(value){
                this.getErrorMessage().setModifier("visible");
            }else{
                this.getErrorMessage().removeModifier("visible");    
            }            
            this.getErrorMessage().setText(value);
        }
    });

});
