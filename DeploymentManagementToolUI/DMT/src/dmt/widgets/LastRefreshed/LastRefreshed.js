define([
    'jscore/core',
    "./LastRefreshedView"
], function (core, View) {

    /**
     * Gets the current time and Date.
     * @returns {string}  the current time and date.
     * @private
     */
    var _getCurrentTimeAndDate = function() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var day = currentTime.getDate();
        var month = currentTime.getMonth() + 1;
        var year = currentTime.getFullYear();
        var date = day + "/" + month + "/" + year;
        if(hours < 10){
            hours = "0" + hours;
        }
        if(minutes < 10){
            minutes = "0" + minutes;
        }
        var time = hours + ":" + minutes;

        var res = time + " " + date;

        return res;
    };


     /**
     * Sets the view time stamp with the current time and and date
     * @param view   the view where the timestamp has to be set
     * @param currentTimeAndDate  the current time and Date
     * @private
     */

   var _setTimeStamp = function (view, currentTimeAndDate) {
        view.setTimeStampElement(currentTimeAndDate);
    };


    return core.Widget.extend({

        View: View,

        onViewReady: function () {
            _setTimeStamp(this.view, _getCurrentTimeAndDate);
        }
    });

});