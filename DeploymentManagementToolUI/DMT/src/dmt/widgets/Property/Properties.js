define([
    "jscore/core",
    "jscore/ext/utils/base/underscore",
    "widgets/Button",
    "./PropertiesView",
    "../../widgets/List/List",
    "../../widgets/PropertyHeader/PropertyHeader",
    "./../../ext/Properties/PropertiesModel",
    "./../../ext/Notification/Notification",
    "./../../ext/CRUD/MessageParser",
    "./../../ext/CRUD/CRUD",
    "./../../ext/Properties/PropertiesUtils",
    "../../widgets/Loader/Loader",
    "./../../ext/CRUD/PayloadParser"
], function(core, _, Button, View, ListWidget, PropertyHeaderWidget, MODEL, NOTIFICATION, MESSAGE_PARSER, CRUD, UTILS, Loader, PAYLOAD_PARSER) {

    var _propertyHeader, _list;
    var _loader = new Loader();
    var _eventBus;
    var _propertiesRegionView;

    /**
     * Retrieve PropertyFields based GET request
     * @param response
     * @param properties
     * @param editMode
     * @private
     */
    var _loadProperties = function(response, properties, path, options){
        _loader.detach();
        UTILS.setPropertyFields.call(this.model, response);

        //Set the propertyHeader
        _propertyHeader = new PropertyHeaderWidget({properties: properties, editMode: options.editMode});
        _propertyHeader.attachTo(this.getElement());

        //Set the item property fields - REGEX
        _list = new ListWidget({path: path, parent: this, editMode: options.editMode, model:this.model});
        _list.attachTo(this.getElement());

        //Start Event Handlers
        this.startEventHandlers(options, path);
    };

    var _loadPropertiesError = function(response){
        _loader.detach();
        var messages = MESSAGE_PARSER.getMessages(response),
            messageText = MESSAGE_PARSER.getText(messages[0]);

        //Todo use HTTP status code - check this
        var errorType = {type:"Not Found"};
        _eventBus.publish("propertyInfo", errorType);
    };

    /**
     * Sets the widgets with the properties
     * @private
     * @param properties
     * @param path
     * @param options
     */
    var _setProperties = function (properties, path, options) {
        this.model = new MODEL({
            errorStatus: false
        });

        //Properties model creation
        UTILS.setPropertyModel.call(this.model, properties);
        UTILS.allowUpdateProperties.call(this, this.model);
        if(options.editMode){
            var typeURI = PAYLOAD_PARSER.getResourceLinkByKey(properties, "type");

            var request = CRUD.get(typeURI,
                function(response){
                    _loadProperties.call(this, response, properties, path, options);
                }.bind(this),
                _loadPropertiesError);

            if(request.getReadyState() === 1){
                _loader.attachTo(options.parent);
            }
        } else {
            _loadProperties.call(this, options.data.payload, properties, path, options);
        }


    };

    /**
     * Commit changes to LITP if there is are any.
     * Errors are logged and a Error function is invoked if LITP rejects the changes.
     */
    var _updateProperties = function (path, id, options){
        var properties = this.model.getAttribute("properties");
        this.parent = this.options.dmtView;

        var putObj = {properties:{}},
            closeEditMode = this.view.getCancelButton(),
            parentView = this.parent,
            selfURI = PAYLOAD_PARSER.getResourceLinkByKey(options.data.properties, "self");

        putObj.properties = properties.attributes;

        //Todo this sucks!
        _eventBus = options.eventBus;

        _eventBus.publish("addLoaderInPropPanel");

        var request = CRUD.put(selfURI, function(){
            _updatePropertiesView.call(this, properties, closeEditMode, id, parentView);
        }.bind(this),
            _updatePropertiesViewError, putObj);

        //TODO remove this, getReadyState not effective anymore
        /*if(request.getReadyState() === 1){
         _eventBus.publish("addLoaderInPropPanel");
         }*/
    };

    /**
     * Add new item to LITP
     * @param path
     * @param options
     * @private
     */
    var _addItem = function (path, options ){

        var properties = this.model.getAttribute("properties"),
            id = _propertyHeader.getId(),
            _eventBus = options.eventBus,
            node = options.node;

        this.parent = this.options.dmtView;

        var parentView = this.parent;

        var postObj = {"id":id,"type":options.data.type.name};

        //TODO May not be supported in non "ECMAScript 5" browsers - check this
        if(Object.keys(properties.attributes).length > 0){
            postObj.properties = properties.attributes;
        }

        var loadProperties = function(){
            this.model.set("hasChanged", false, {silent: true});
            properties._originalAttributes = _.clone(properties.attributes);
            _list.disableEdit(options);
            //TODO these 2 events, "addItem" & "addChild" are the same should be combined as one called 'addItem' - use the EventBus instead of customEvent!
            var event = new CustomEvent("addItem");
            options.parent.element.dispatchEvent(event);

            _eventBus.publish("addChild", {"id":id, "node":node});

            // instantiates the Notification and sets its attributes
            var notification = NOTIFICATION.start('Successfully added item \"'+id+'\" to the model', 'success', 'green', 'tick', true);
            _eventBus.publish("removeLoaderFromPropPanel");
            notification.attachTo(parentView);
        };

        var loadPropertiesError = function(response){
            _eventBus.publish("removeLoaderFromPropPanel");
            var messages = MESSAGE_PARSER.getMessages(response);

            //Resets all Litp error messages
            _propertyHeader.removeLitpErrorMessage();
            _list.removeLitpErrorMessages();

            messages.forEach( function(message) {
                var type = MESSAGE_PARSER.getType(message),
                    propertyName = MESSAGE_PARSER.getName(message),
                    messageText = MESSAGE_PARSER.getText(message);

                if((propertyName === "item id" || type === "Exists" || type === "NotAllowed") && messageText){
                    _propertyHeader.addLitpErrorMessage("item", messageText);
                } else if(type !== "Unknown" && messageText){
                    _list.addLitpErrorMessage(propertyName, messageText);
                }
            });

            var messageCount = MESSAGE_PARSER.getCount(messages);

            // instantiates the Notification and sets its attributes
            var errorNotification = NOTIFICATION.start(messageCount, 'error', 'red', 'error', false);

            // over rides the style that is set in the Notification widget
            errorNotification.view.getElement().setStyle("top","-30px");
            errorNotification.attachTo(_propertiesRegionView);
        };

        var selfURI = PAYLOAD_PARSER.getResourceLinkByKey(node, "self");

        _eventBus.publish("addLoaderInPropPanel");

        CRUD.post(selfURI, loadProperties.bind(this), loadPropertiesError, postObj);
    };

    var _updatePropertiesView = function(properties, closeEditMode, id, parentView) {

        _eventBus.publish("removeLoaderFromPropPanel");

        //Reset the model changed status to false and sets the original attributes to the changed ones
        this.model.set("hasChanged", false, {silent: true});
        properties._originalAttributes = _.clone(properties.attributes);

        closeEditMode.trigger("click");

        // instantiates the Notification and sets its attributes
        var notification = NOTIFICATION.start('Successfully updated item \"'+id+'\"', 'success', 'green', 'tick', true);
        notification.attachTo(parentView);

    };

    var _updatePropertiesViewError = function(response){

        _eventBus.publish("removeLoaderFromPropPanel");

        //Invalid property value, use the data response to highlight the property value with a message
        var messages = MESSAGE_PARSER.getMessages(response);

        // resets all Litp error messages
        _list.removeLitpErrorMessages();

        // appends the error message from LITP to the ListItem
        messages.forEach( function(message) {
            var propertyName = MESSAGE_PARSER.getName(message),
                messageText = MESSAGE_PARSER.getText(message);
            _list.addLitpErrorMessage(propertyName, messageText);
        });

        var displayMessage = messages.length === 1 ? "There is 1 error below" : "There are " + messages.length + " errors below";

        // instantiates the Notification and sets its attributes
        var unsuccessfulNotification = NOTIFICATION.start(displayMessage, 'error', 'red', 'error', false);

        // over rides the style that is set in the Notification widget
        unsuccessfulNotification.view.getElement().setStyle("top","-30px");
        unsuccessfulNotification.attachTo(_propertiesRegionView);
    };

    return core.Widget.extend({

        View: View,

        init: function(){},

        onViewReady: function (options) {
            var payload = options.data,
                path = payload.path,
                properties,
                type;

            _propertiesRegionView = this.view.getElement();

            _eventBus = options.eventBus;

            if(options.editMode === true){
                properties = payload.properties;
            }
            else if(options.editMode === false){
                //TODO remove the properties hardcoded object when LITP itemTypes fixed
                var propertyFields = options.data.propertiesFields;
                type = payload.type.name;

                properties = {"id":"","state":"null", "properties":{}, "type":type};

                //TODO This was discussed by Caitriona in the DMT-UI review meeting 12/03/14
                //Returns a default if set, otherwise an empty string is returned @Caitriona
                var getDefaultVal = function(obj){
                    if(obj.defaultValue){
                        return obj.defaultValue;
                    }
                    //This is going to be a problem
                    return undefined;
                };

                propertyFields.forEach(function(property){
                    properties.properties[property.id] = getDefaultVal(property);
                });
            }
            _setProperties.call(this, properties, path, options);
        },

        //TODO Refactor below to reuse as much code as possible, Polymorphism - check this
        startEventHandlers: function (options, path) {
            this.view.addCommitClickHandler(function () {
                if(options.editMode === true){
                    _updateProperties.call(this, path, options.node.name, options);
                }
                else if(options.editMode === false){
                    _addItem.call(this, path, options);
                }
            }.bind(this));

            //TODO Fix the way Commit and Cancel Button is instantiated
            if(options.editMode === false){
                var event = new CustomEvent("addMode");
                options.parent.element.dispatchEvent(event);
                if(_list.view.getElement().children().length > 0){
                    _list.enableEdit(options.editMode);
                    //this.view.disableCommitButton();
                } else{
                    //Set Mode to add, fix List Element Height
                    _list.setMode("add");
                }
                this.view.getCancelButton().setModifier("visible");
                this.view.getCommitButton().setModifier("visible");
                this.view.getCommitButton().setText("Add Item");
            }

            this.view.addEditClickHandler(function () {
                //Event Triggers Enables Edit Mode
                var event = new CustomEvent("editMode");
                options.parent.element.dispatchEvent(event);
                _list.enableEdit(options.editMode);

                this.view.getCancelButton().setModifier("visible");
                this.view.getCommitButton().setModifier("visible");
                this.view.disableCommitButton();
            }.bind(this));

            this.view.cancelClickHandler(function() {
                var event;
                if(options.editMode === false){
                    event = new CustomEvent("cancelAddMode");
                    options.parent.element.dispatchEvent(event);
                }else if(options.editMode === true){
                    event = new CustomEvent("cancelEditMode");
                    options.parent.element.dispatchEvent(event);
                    this.model.set("hasChanged", false, {silent: true});
                }
                //Event Triggers Cancel Edit Mode
                _list.disableEdit(options);
                this.view.getCancelButton().removeModifier("visible");
                this.view.getCommitButton().removeModifier("visible");
                this.view.disableCommitButton();
            }.bind(this));
        }
    });
});
