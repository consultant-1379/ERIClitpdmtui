define([
    "jscore/core",
    "jscore/ext/mvp",
    "jscore/ext/utils/base/underscore"
], function(core, mvp, _){

    var ObjModel = mvp.Model.extend();

    return {

        /**
         * Adds the available node fields to the model obj,
         * each field contains a list of key value pairs,
         * including the REGEX pattern.
         * @param obj
         * @private
         */
        setPropertyFields: function(obj){
            var fields = obj.properties;
            this.set("fields", new ObjModel(fields), {silent: true});
        },

        /**
         * Adds properties object to the model,
         * representing the current node's properties.
         * @param obj
         * @private
         */
        setPropertyModel: function(obj){
            var properties = new ObjModel(obj.properties);
            this.set("properties", properties, {silent: true});
            //_originalAttributes is set to preserve the initial state of the model
            properties._originalAttributes = _.clone(properties.attributes);

            this.set("hasChanged", false);
            this._hasPropertiesChanged = function() {
                if(JSON.stringify(properties.attributes) !== JSON.stringify(properties._originalAttributes)){
                    this.set("hasChanged", true);
                }else{
                    this.set("hasChanged", false);
                }
            }.bind(this);
        },

        /**
         * Detects whether there is any error's in the properties fields.
         * If errorStatus is true --> Disable commitButton
         * Else --> Enable commitButton
         * @param model
         * @private
         */
        allowUpdateProperties: function (model) {
            model.getAttribute("properties").on("change", function () {
                model._hasPropertiesChanged();
            });
            model.on("change:errorStatus change:hasChanged", function () {
                if(model.getAttribute("hasChanged") === true && model.getAttribute("errorStatus") === false){
                    this.view.getCommitButton().setProperty("disabled",false);
                } else {
                    this.view.disableCommitButton();
                }
            }.bind(this));
        },

        /**
         * Check if the node has fields or collections
         * @param obj
         * @returns {name|*|require.name|components/LogoutButton/LogoutButton.name|_selectBox.value.name|event.detail.type.name}
         */
        getItemType: function(obj){
            var type = obj.name;
            if (obj.collection){
                type = obj.collection.type.name;
            } else if (obj.type){
                type = obj.type.name;
            } else if (obj.collection === undefined && obj.type === undefined && obj.uri !== undefined){
                var n = obj.uri.lastIndexOf('/');
                type = obj.uri.substr(n + 1);
            } else if (obj.collection === undefined && obj.type === undefined && obj.uri === undefined){
                //Todo this will be removed as soon as DMT Service Parses the Payload in usable, easy way - check this
                // cuts off "collection-of-"
                if (obj.name.match(/collection-of-/g)) {
                    type = obj.name.substr(14);
                } else if (obj.name.match(/reference-to-/g)) {
                    type = obj.name.substr(13);
                }
            }
            return type;
        }
    };
});