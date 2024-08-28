define([
    'jscore/core',
	"text!./DMT.html",
	"styles!./DMT.less"
], function (core, template, style) {
	return core.View.extend({
		
		getTemplate: function() {
			return template;
		},
		
		getStyle: function() {
			return style;
		},

        shortcuts: function(fn) {
             document.addEventListener("keyup", fn);
        }
		
	});

});