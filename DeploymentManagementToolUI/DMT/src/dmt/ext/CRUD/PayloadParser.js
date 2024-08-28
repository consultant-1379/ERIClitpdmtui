define([],function() {

    var _resourceKeys = {
        "children":"children",
        "type":"item_type",
        "addableChildren":"addable_types",
        "self":"self"
    };

    var _getLinks = function(payload){
        return payload.links;
    };

    var _getResourceKey = function(key){
        return _resourceKeys[key];
    };

    return {
        getResourceLinkByKey: function(payload, key){
            var links = _getLinks(payload);
            var resourceKey = _getResourceKey(key);
            return links[resourceKey];
        },

        getLinks:function(payload){
            return _getLinks(payload);
        }
    };
});