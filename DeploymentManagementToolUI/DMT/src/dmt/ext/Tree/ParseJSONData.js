define( function () {

    /**
     * This method is responsible for recursively discovering node objects and adding them to an discoverNodes object
     * which will be ultimately rendered in the DMT tree view. If a discover node has child nodes, then this method will
     * recursively add the children to its parent.  The returned discoverNodes object will be in a parent-> child tree
     * structure

     * @param nodeGroup  the root json object that is to be parsed.
     * @param depth   starting depth level which is 1.
     * @param maxdepth  the maximum depth which is currently restricted to a maximum of 15..
     * @returns {Array}  the discovered node objects in a parent->children tree structure format.
     * @private
     */
    var _discoverNodes = function(nodeGroup, depth, maxdepth){
        //Iterate through all the nodes in the tree restricted to a certain depth
        var children = [];
        for (var key in nodeGroup) {
            if (nodeGroup.hasOwnProperty(key)) {
                var child_node = nodeGroup[key];
                if (child_node !== null && typeof child_node === "object" && !(child_node instanceof Array)) {
                    var subtree;
                    if (depth <= maxdepth) {
                        //For the new LITP JSON structure ".children" is needed to traverse down a level
                        subtree = _createSubTree(key, _discoverNodes(child_node.children, depth + 1, maxdepth));
                    } else {
                        subtree = _createSubTree(key, []);
                    }
                    children.push(subtree);
                } else {
                    children.push(_createSubTree(key, null));
                }
            }
        }
        return children;
    };

    /**
     *  Method is responsible for creating the sub tree, by adding the child node objects to its parent object
     * @param name   parent node object
     * @param children  children objects
     * @returns {{}}   the subtree containing the parent and its children.
     * @private
     */
   var _createSubTree=  function(name, children){
        var subtree = {};
        subtree.name = name;
        if (children !== null && children.length > 0) {
            subtree.children = children;
        }
        return subtree;
    };

    var _simpleParser = function(children){
        var nodes = [];
        children.forEach(function(child){
           nodes.push({name:child.id});
        });
        return nodes;
    };

    return {

        /**
         * Fetches the parsed Deployment Model. The model returned is now formatted in a / parent-child tree node
         * structure, ready to be rendered into a tree structure in the DMT tree view.
         *
         * @param data the deployment model data that is to be parsed into a tree structure.
         * @returns {{name: string, children: *}}   parsed data in a /parent-child tree node structure, like for example
         * "/inventory/deployment1/etc....."
         */
        getParsedLandscape: function(children){
            //var discovered = _discoverNodes(data, 1, 15);
            // Add a top-level nodeGroup.
            return {
                "name": "/",
                "children": _simpleParser(children)
            };
        },

        getParsedChildren: function(data){
            var discovered = _discoverNodes(data, 1, 15);
            return discovered;
        }
    } ;
});