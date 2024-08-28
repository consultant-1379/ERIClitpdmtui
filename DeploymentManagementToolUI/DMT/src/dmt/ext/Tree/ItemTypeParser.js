//TODO merge this with other ItemTypeParser class
define([],function() {

    /**
     * Parse the actual LITP Itemtype, used by the CRUD functions
     * @param obj
     * @returns type
     * @private
     */
    var _parseType = function(obj){
        var type = obj.type;
        if(type === undefined){
            return undefined;
        }
        return type;
    };

    return {
        getItemType: function(obj){
            return _parseType(obj);
        }
    };
});


