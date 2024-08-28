define([],function() {

    var items;

    return {

        /**
         * Get the item type, useful for @GET request on /item-types
         * @param obj
         * @param id
         * @returns {}
         */
        getItemType: function(obj, id){
            return id;
        },

        /**
         * Gets and parses the Ids of each item, the id is used as a label visible on the SelectBox
         * @param obj
         * @returns {Array}
         */
        getItemsWithName: function(obj){
            items = obj.item_types;
            var result = [];
            if(items){
                items.forEach(function(item){
                    result.push({"name":item.name});
                });
            }
            return result;
        },

        /**
         * Get item's property fields
         * @param obj
         * @returns {properties|*|_propertyHeader.properties|event.detail.properties|putObj.properties|postObj.properties}
         */
        getFields: function(obj){
            //TODO Return empty array if properties undefined
            items = obj.properties;
            return items;
        },

        getItemByName: function(obj, name){
            items = obj.item_types;
            return items.filter(function(item){
                return item.name === name;
            })[0];
        }
    };
});


