define([
    'jscore/core',
    "./NavigationBarResultView"
], function (core, View) {
    var selectIndex = -1;
    return core.Widget.extend({

        view: function() {
            return new View(this.options);
        },
        
        onViewReady: function(options) {
            this.extendFn(this.view.getElement());
            this.view.addHoverEventHandler();
            this.view.addClickEventHandler(options.nav);
            selectIndex = -1;
        },
        
        extendFn: function(element) {
            element.next = function(){
                return this.element.nextSibling;
            };            
        },

        setIndex: function(index){
            selectIndex = index;
        },

        getIndex: function(){
            return selectIndex;
        }
    });

});