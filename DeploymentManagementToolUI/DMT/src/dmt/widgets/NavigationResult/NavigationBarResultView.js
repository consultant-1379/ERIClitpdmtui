define([
    "jscore/core",
    "template!./NavigationBarResult.html",
    "styles!./NavigationBarResult.less",
    "jscore/base/jquery"
], function(core, template, style, $) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getNavBarResultPane: function() {
            return this.getElement();
        },

        getNavBarResultItems: function() {
            return this.getElement().children();
        },

        getNavBarResultItemById: function(id) {
            return this.getElement().find(id);
        },

        /*======================EventHandlers=============================*/
        addHoverEventHandler: function() {
            var self = this;
            this.getNavBarResultItems().forEach(function(item){
                item.addEventHandler("mouseover", function(e){
                    self.getNavBarResultItemById(e.originalEvent.currentTarget).setModifier("selected");
                });
                item.addEventHandler("mouseout", function(e){
                    self.getNavBarResultItemById(e.originalEvent.currentTarget).removeModifier("selected");
                });
            });
        },
        addClickEventHandler: function(navBar) {
            var self = this;
            this.getNavBarResultPane().addEventHandler("mousedown", function(e){
                e.preventDefault();    
            });
            this.getNavBarResultItems().forEach(function(item){
                item.addEventHandler("click", function(e){
                    //Updates results dropDown, does not execute getting properties for path
                    var path = self.getNavBarResultItemById(e.originalEvent.currentTarget).getText();
                    navBar.path.setValue(path + "/");
                    navBar.pathText =  path + "/";
                    navBar.path.trigger("blur");
                });
            });
        }
    });

});