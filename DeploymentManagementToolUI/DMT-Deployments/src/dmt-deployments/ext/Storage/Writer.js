define([],function(){
    var _storageName = "working_copies",
        _workingCopyObj = {wc:[]},
        _DB = localStorage;

    var _checkStorageIsPopulated = function(key){
        return _DB.getItem(key).length > 0;
    };

    return {

        addWorkingCopiesToDB: function(obj){

            _workingCopyObj.wc = obj;

            var _workingCopy = JSON.stringify(_workingCopyObj);
            _DB.setItem(_storageName, _workingCopy);
        }

    };
});