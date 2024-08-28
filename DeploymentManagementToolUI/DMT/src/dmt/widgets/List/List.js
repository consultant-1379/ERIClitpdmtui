define([
    "jscore/core",
    "jscore/ext/utils/base/underscore",
    "./ListView",
    "../ListItem/ListItem"
], function(core, _, View, ListItem) {
    var model,
        _listItems = [],
        parentElement;

    /**
     ** Method responsible for loading up property headings and its children.
     * @param obj  A list of property objects that are to be displayed.
     * @private
     */
    var _fetchProperties = function(obj) {
        //TODO Check for type TASK, as it may not be intended to be editable because there are no regex fields
        for (var index in obj) {
            if(index === "properties" && obj.hasOwnProperty(index)){
                var properties = obj[index],
                    fields = obj.fields;
                    for(var key in properties){
                        if(properties.hasOwnProperty(key)){
                            _setListItem(key, properties[key], fields);
                        }   
                    }
                break;                    
                }
            }
        };

    /**
     * Method loads children property items if any that is to be displayed on this widget under its parent property
     * heading.
     * @param id     The properties index that is to be displayed.
     * @param val    A list of property objects that are to be displayed.
     * @private
     */
    var _setListItem = function(id, val, fields) {
        var regex = null;
        var fieldObj = {};
        fieldObj.key = id;
        fieldObj.value = val;
        var propertyFields =  model.getAttribute("fields").toJSON();

        if(propertyFields) {
            for(var key in propertyFields){
                if(propertyFields.hasOwnProperty(key) && propertyFields[key].id === id){
                    regex = propertyFields[key].regex; 
                    break;
                }
            }
        }

        var listItem = new ListItem({model: model, field: fieldObj, regex: regex});

        
        listItem.attachTo(parentElement);
        _listItems.push(listItem);
    };

    return core.Widget.extend({
        View:View,
        onViewReady: function(options) {
            if(options){
                this.url = options.url;
                this.parent = options.parent;
                this.setListItems(options);
                if(options.editMode === false){
                    this.view.getElement().setModifier("add");
                }    
            }            
        },

        /**
         *  Loads and Sets the property panel with the properties
         * @param options node property object containing the properties..
         */
        setListItems: function(options){
            model = options.model;
            var obj = model.toJSON();
            parentElement = this.getElement();

            //Ensure the listItems array is empty on initial load
            _listItems = [];

            _fetchProperties(obj);
        },

        /**
         * Enable each listItem editing view
         */
        enableEdit: function(editMode){
            for(var i = 0; i < _listItems.length; i++){
                _listItems[i].enableEdit(editMode);
            }
        },

        /**
         * Reset each listItem Widget to its default view and
         * restore the model to the original attributes
         */
        disableEdit: function(options){
            //Loop through each listItem and reset to default display
            for(var i = 0; i < _listItems.length; i++){
                _listItems[i].disableEdit(options);
            }
            //Restore model to original values
            var properties = model.getAttribute("properties"),
                previousAttr = properties._originalAttributes;
            if(previousAttr){
                properties.set(previousAttr, {silent: true});
            }
        },

        /**
         * Enable each listItem editing view
         * @param key associated field
         * @param errorMessage  Litp error message
         */
        addLitpErrorMessage: function(key, errorMessage) {
            for(var i = 0; i < _listItems.length; i++){
                _listItems[i].addLitpErrorMessage(key, errorMessage);
            }
        },

        /**
         * Remove error message for each listItem
         */
        removeLitpErrorMessages: function() {
            for(var i = 0; i < _listItems.length; i++){
                _listItems[i].removeLitpErrorMessages();
            }
        },
        
        //Strictly CSS - For use by external call, do not remove!
        //TODO can be used a setter in Sprint 2.1.2 - added on 27/02/2014
        setMode: function(mode){
            this.view.getElement().setModifier(mode);    
        }
    });
});