define([
    "jscore/ext/mvp",
    "jscore/ext/utils/base/underscore"
],function(mvp, _) {
    return mvp.Model.extend({
        /**
         * Handles the Error Validation check for the model,
         * errorStatus is true if any there's any invalid field.
         */
        checkError: {
            errorObj: {},
            addErrorObj: function (key){
                this.checkError.errorObj[key] = true;
                if(this.getAttribute("errorStatus") === false){
                    this.checkError.setErrorStatus.call(this, true);
                }
            },
            removeErrorObj: function (key){
                for(var obj in this.checkError.errorObj){
                    if(this.checkError.errorObj.hasOwnProperty(key)){
                        delete this.checkError.errorObj[key];
                    }
                }
                if(_.isEmpty(this.checkError.errorObj)){
                    this.checkError.setErrorStatus.call(this, false);
                }
            },
            getErrorStatus: function () {
                return this.getAttribute("errorStatus");
            },
            setErrorStatus: function (boolean) {
                this.set("errorStatus", boolean);
            },
            resetErrorStatus: function () {
                this.checkError.setErrorStatus(false);
                this.errorObj = {};
            }
        }
    });
});
