define([
    "widgets/Notification"
], function(NotificationWidget){
    return {
        start: function (message, type, color, icon, boolean) {
            return new NotificationWidget({
                label: message,
                content: type,
                color: color,
                icon: icon,
                showCloseButton: boolean,
                showAsToast: true,
                autoDismiss: true
            });
        }
    };
});
