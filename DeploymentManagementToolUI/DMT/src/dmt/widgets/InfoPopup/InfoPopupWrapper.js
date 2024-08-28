define([
	'jscore/core',
	'widgets/InfoPopup'
], function(core, InfoPopup) {
	return core.Widget.extend({
		onViewReady: function() {
			this.infoPopup = new InfoPopup({
                    content: this.HTMLForInfoBox(),
                    persistent: true
            });
            
            // remove the close button, as per mockup
            this.infoPopup.view.getCloseButton().setProperty("hidden", true);
            
            var checkbox = this.infoPopup.view.getContent().find(".eaDMT-wHelpbox-checkbox");
            // apply styling to info popup
            this.setInfoPopupStyle(this.infoPopup);
           
            this.infoPopup.view.getInfoIcon().addEventHandler('click', function () {
                if (localStorage.getItem("display") === "false") {
                    this.infoPopup.view.getContent().find(".tickboxMessage").setProperty("hidden", true);
                }
            }.bind(this));
            
            this.infoPopup.view.getContent().find(".ebBtn").addEventHandler("click", function() {
                this.infoPopup.view.getInfoIcon().trigger("click");
                if (checkbox.getProperty("checked") === true) {
                    localStorage.setItem("display", false);
                }
            }.bind(this));

            this.infoPopup.attachTo(this.getElement());
		},
		onDOMAttach: function() {
			if (localStorage.getItem("display") !== null) {
                this.infoPopup.setVisible(false);
            } else {
                this.infoPopup.setVisible(true);
            }
		},
		HTMLForInfoBox: function() {
            return '<h3>Navigating the Model</h3>' +
                '<h4>Zoom</h4>' +
                '<p>Use the wheel on your mouse to zoom in and out of the expanded model.</p>' +
                '<h4>Pan</h4>' +
                '<p>Holding down the left mouse button allows you to drag the model within the viewing window.</p>' +
                '<h4>Get Started</h4>' +
                '<p>Click on the disc with the <span class="eaDMT-wLegend-closedIcon"></span> on the left of the viewing window to begin expanding the model.</p>' +
                '<div class="tickboxMessage">' +
                '<input class="eaDMT-wHelpbox-checkbox ebCheckbox" type="checkbox" value="1" />' +
                '<span class="ebCheckbox-inputStatus"></span>' +
                '<span class="ebCheckbox-label">Do not show me this on start up</span>' +
                '</div>' +
                '<button class="ebBtn ebBtn_wMargin ebBtn_color_darkBlue ebBtn_colored">Close</button>';
        },
        setInfoPopupStyle: function(infoPopup) {
            this.infoPopup.view.getContent().setStyle({
                "width":"550px"
            });
        }
	});

});