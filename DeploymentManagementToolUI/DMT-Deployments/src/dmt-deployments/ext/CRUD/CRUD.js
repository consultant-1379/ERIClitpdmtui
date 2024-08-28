define([
    "jscore/ext/net"
],function(net) {
    var _net = function(url, type, successFn, errorFn){
        return net.ajax({
            url: url,
            type: type,
            dataType: 'json',
            success: successFn,
            error: errorFn
        });
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
        post: function (url, successFn, errorFn) {
            return  _net(url, "POST", successFn, errorFn);
        },

        /**
         * Put Request
         * @param url
         * @param successFn
         * @param errorFn
         * @returns {}
         */
        put: function (url, successFn, errorFn) {
            return _net(url, "PUT", successFn, errorFn);
        }
    };
});