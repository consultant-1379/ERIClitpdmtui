define([],function() {

    var types = {
        "InvalidLocationError": "404",
        "RegexError": "Regex",
        "InvalidPropertyError": "InvalidProperty",
        "MissingRequiredPropertyError": "RequiredProperty",
        "MissingRequiredItemError": "RequiredItem",
        "ItemExistsError": "Exists",
        "InvalidTypeError": "InvalidType",
        "ChildNotAllowedError": "NotAllowed"
    };

    var _parseMessages = function(response){
        return response.payload.messages;
    };

    var _parseType = function(message){
        var type = message.type,
            simpleErrorType = "Unknown";

        for(var key in types){
            if(types.hasOwnProperty(key) && type === key){
                simpleErrorType = types[key];
                break;
            }
        }

        return simpleErrorType;
    };

    var _parseText = function(message){
        var text = message.message;        
        return text;
    };

    var _parseName = function(message){
        var name = message.refersTo;
        return name;
    };

    return {
        getType: function(message) {
            return _parseType(message);
        },

        getText: function(message) {
            return _parseText(message);
        },

        getName: function(message) {
            return _parseName(message);
        },

        getCount: function(messages) {
            return messages.length === 1 ? "There is 1 error below" : "There are " + messages.length + " errors below";
        },

        getMessages: function(payload) {
            return _parseMessages(payload);
        }
    };
});