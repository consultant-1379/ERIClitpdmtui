define([
    'jscore/core',
    "./PropertyHeaderView"
], function (core, View) {

    /**
     * Responsible for setting the Node name and Node status in the Property Header
     * @param properties - item properties
     * @param view - set id and state on the view
     * @private
     */
    var _createPanelHeader = function(obj, view) {
        view.setNodeName(obj.id);
        view.setState(obj.state);
    };

    return core.Widget.extend({

        View: View,

        onViewReady: function(options){
            var properties = options.properties;
            _createPanelHeader(properties, this.view);
            
            if(options.editMode === false && (options.error === false || options.error === undefined)){
                this.view.getElement().setModifier("add");
            } else if (options.error === true){

            }
        },
        
        getId: function(){
            return this.view.getId();
        },

        addLitpErrorMessage: function(name, value){
            this.view.setErrorMessage(value);
        },

        removeLitpErrorMessage: function(){
            this.view.setErrorMessage("");
        }
    });
});