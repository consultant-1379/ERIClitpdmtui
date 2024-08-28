define({
    name: "OSS",
    defaultApp: 'dmt-deployments',
    error: function () {
        this.applicationHolder.innerHTML = "<div class='eb404Page'>\
                                        <div class='eb404Page-boxHolder'>\
                                            <div class='eb404Page-textBox'>\
                                                <div class='eb404Page-header'>\
                                                    <span class='eb404Page-header-icon'></span>\
                                                    <h1 class='eb404Page-header-title'>Application Not Found</h1>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>"
    }

});
