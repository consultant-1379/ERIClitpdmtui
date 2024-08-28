define([
    "jscore/ext/net"
],function(net) {
    var _net = function(url, type, successFn, errorFn, payload){
        var options = {
            url: url,
            type: type,
            processData: false,
            success: function(data, textStatus, jqXHR ) {
                successFn(data ? JSON.parse(data) : data, textStatus, jqXHR);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                errorFn({
                    "errorCode" : textStatus.getStatus(),
                    "errorDesc" : textStatus.getStatusText(),
                    "payload" : textStatus.getResponseJSON()
                });
            }
        };
        if(type === "POST" || type === "PUT"){
            payload = JSON.stringify(payload);
            options.contentType = "application/json";
            options.data = payload;
        }
        return net.ajax(options);
    };

    return {

        /**
         * Delete Request
         * @param url
         * @param successFn
         * @param errorFn
         * @returns {}
         */
        delete: function (url, successFn, errorFn) {
            return _net(url, "DELETE", successFn, errorFn);
        },

        /**
         * Get Request
         * @param url
         * @param successFn
         * @param errorFn
         * @returns {}
         */
        get: function (url, successFn, errorFn) {
            return _net(url, "GET", successFn, errorFn);
        },

        /**
         * Post Request
         * @param url
         * @param successFn
         * @param errorFn
         * @returns {}
         */
        post: function (url, successFn, errorFn, payload) {
            return  _net(url, "POST", successFn, errorFn, payload);
        },

        /**
         * Put Request
         * @param url
         * @param successFn
         * @param errorFn
         * @returns {}
         */
        put: function (url, successFn, errorFn, payload) {
            return _net(url, "PUT", successFn, errorFn, payload);
        }
    };
});