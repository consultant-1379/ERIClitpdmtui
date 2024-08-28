define([
    "jscore/core",
    "text!./Loader.html"
], function(core, template) {
    return core.View.extend({
        getTemplate: function() {
            return template;
        }
    });
});
