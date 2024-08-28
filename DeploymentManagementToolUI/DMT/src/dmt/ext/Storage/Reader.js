define([],function(){
    var _storageName = "working_copies",
        _DB = localStorage;

    var _getWorkingCopies = function(key){
        return JSON.parse(_DB.getItem(key));
    };

    var _getWorkingCopyById = function(id, wCopies){
        return wCopies.filter(function(wCopy){
           return wCopy.id === id;
        })[0];
    };

    var _getWorkingCopyLinks = function(wCopy){
        return wCopy.links;
    };

    return {

        /**
         * Get an array of WorkingCopies
         * @returns {_workingCopyObj.wc|*|tableWidget.wc|tableRegion.wc|CreateDelete.addNodeWidget.wc|CreateDelete.deleteNode.wc}
         */
        getWorkingCopiesFromDB: function(){
            return _getWorkingCopies(_storageName).wc;
        },

        /**
         * Get WorkingCopy based on {id}
         * @param id
         * @returns {}
         */
        getWorkingCopy: function(id){
            var wCopies = this.getWorkingCopiesFromDB();
                //wCopy = _getWorkingCopyById(id, wCopies);
            return _getWorkingCopyById(id, wCopies);
        }

    };
});