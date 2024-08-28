define([
    "jscore/core",
    "jscore/base/jquery",
    "jscore/ext/utils/base/underscore",
    "../Tree/ParseJSONData",
    "../CRUD/CRUD",
    "../CRUD/PayloadParser"
], function(core, $, _, TREE_PARSER, CRUD, PAYLOAD_PARSER){

    /**
     * Keyboard shortcut codes
     * @type {{ENTER: number, UP: number, DOWN: number, TAB: number, ESCAPE: number}}
     * @private
     */
    var _keys = {
            ENTER: 13,
            UP: 38,
            DOWN: 40,
            TAB: 9,
            ESCAPE: 27
        },
        _list,
        _listItems,
        _nextIndex = 0,
        _previousIndex = 0,
        _currentIndex = 0,
        _current;

    /**
     * Scroll through result pane using keyboard keys, UP, DOWN and TAB
     * @param b = currentlySelected index of the results list
     * @private
     */
    var _adjustScroll = function (b) {
        var a, c, d, e;
        if(b !== -1 && b !== _listItems.length){
            try{
                a = _listItems[b]._getHTMLElement().offsetTop;
                c = _list.getElement()._getHTMLElement().scrollTop;
                d = c + 300 - 23;
                e = a - 300 + 23;
                if (a < c) {
                    _list.getElement()._getHTMLElement().scrollTop = a;
                } else if (a > d) {
                    _list.getElement()._getHTMLElement().scrollTop = e;
                }
            }catch(error){
                console.log(error, b);
            }
        }
    };

    /**
     * Return a Regular Expression
     * @param pattern
     * @returns {RegExp}
     * @private
     */
    var _createRegexPattern = function (pattern) {
        return new RegExp(pattern);
    };

    /**
     * Gets children for the node
     * @param parent
     * @param currentPath
     * @return parentNode children regardless is they are visible on the tree view
     * @private
     */
    var _getChildren = function (parent){
        var children = parent.children ? parent.children : parent._children,
            deferred = $.Deferred();
        if(children === undefined && parent.hasChildren){

            var _loadChildren = function(response) {
                var result = TREE_PARSER.getParsedLandscape(response.children);
                parent._children = result.children;
                parent.children = null;

                parent._children.forEach(function(child, index){
                    child.hasChildren = response.children[index].children;
                    child.parent = parent;
                    child.links = response.children[index].links;
                });

                var event = _publishEvent("updateTree", parent);
                this.view.dispatchEvent(event);

                children = parent._children;

                //Reomve the Spinner from the Button
                this.enterButtonIcon.removeModifier("loading");

                deferred.resolve(children);
            };

            var _loadChildrenError =  function(e){
                //TODO NB - Disable the Spinner, disable button, display error on NavBar...
                this.enterButton.setAttribute("disabled", true);
                //Reomve the Spinner from the Button
                this.enterButtonIcon.removeModifier("loading");
            };

            this.enterButtonIcon.setModifier("loading");

            var childURI = PAYLOAD_PARSER.getResourceLinkByKey(parent, "children");
            CRUD.get(childURI, _loadChildren.bind(this), _loadChildrenError.bind(this));
        }
        else{
            this.enterButton.setAttribute("disabled", false);
            deferred.resolve(children);
        }
        return deferred.promise();
    };

    /**
     * Removes node children from their objects and creates an array of children names
     * @param children
     * @return an array of children names
     * @private
     */
    var _mapChildrenNames = function (children){
        return _.map(children, function (index){ return index.name; });
    };

    /**
     * Builds an array from the path on the Navigation Bar, whilst creating a
     * new array with each child object so that it can be passed on to the Tree
     * Widget.
     * @param parent
     * @param node
     * @param lastNode
     * @param searchResponse
     * @return searchResponse object
     * @private
     */
    var _findNodeChildren = function (parent, node, lastNode, searchResponse){
        var deferredResult = $.Deferred(),
            retrieveChildren = _getChildren.call(this, parent, searchResponse.finalPath);
        if (parent.name === node[0] && parent.name === lastNode && node.length === 1) {
            retrieveChildren.done(function(children){
                searchResponse.children = _mapChildrenNames(children);

                if (parent.name === "/") {
                    searchResponse.pathChildren.push(parent);
                    searchResponse.finalPath = "/";
                }
                deferredResult.resolve(searchResponse);
            });
        }
        else {
            retrieveChildren.done(function(children){
                node.shift();
                var nextPath = node[0];
                children.forEach(function(child){
                    if(nextPath === child.name){
                        searchResponse.pathChildren.push(child);
                        searchResponse.finalPath += child.name + "/";
                        _findNodeChildren.call(this, child, node, lastNode, searchResponse).done(function(searchResponse){
                            deferredResult.resolve(searchResponse);
                        });
                    }
                }.bind(this));
            }.bind(this));
        }
        return deferredResult.promise();
    };

    /**
     * Search the path entered in the Navigation Bar for children
     * and return back an object containing an array of child objects,
     * the finalPath entered, the actual path entered in the nav
     * @param path
     * @param root
     * @return searchResponse
     * @private
     */
    var _searchNodePath = function (path, root){
        var node = path.split('/');
        node[0]="/";
        node.pop();
        var lastNode = node[node.length-1];

        var searchResponse = {
            path:path,
            children:[],
            finalPath: "/",
            pathChildren:[]
        };

        return _findNodeChildren.call(this, root, node, lastNode, searchResponse);
    };

    /**
     * Create a custom event, used by region
     * @param eventName
     * @param eventData
     * @returns {CustomEvent}
     * @private
     */
    var _publishEvent = function (eventName, eventData){
        return new CustomEvent(eventName, {detail:{data:eventData}});
    };

    /**
     * Opens the nodes on the tree view and selects the last node's properties,
     * Uses the event bus to communicate to the TreeWidget by creating two event types
     * 1.getNodeProperties
     * 2.openNode
     * @param root
     * @private
     */
    var _openTreePath = function(root){
        //Opens the nodes on the tree view based on the path
        _searchNodePath.call(this, this.pathText, root).done(function(result){
            var pathChildren = result.pathChildren,
                lastChildIndex = pathChildren.length- 1,
                event;

            pathChildren.forEach(function(child, index){
                event = (index === lastChildIndex) ? _publishEvent("getNodeProperties", child) : _publishEvent("openNode", child);
                this.view.dispatchEvent(event);
            }.bind(this));
        }.bind(this));

    };

    /**
     * Displays the children in a list under the Navigation Bar in the list.
     * If the path enter does not match existing children then the list is hidden from view.
     * @param root
     * @private
     */
    var _getList = function(root){
        //Retrieves results for path entered in Nav Bar
        return _searchNodePath.call(this, this.pathText, root).done(function(data){
            this.result = data;
            if(this.result.children.length > 0 && this.result.path === this.pathText){
                this.lastPath = this.result.finalPath;
                this.result.children.forEach(function(child, index){
                    this.result.children[index] = this.lastPath + child;
                }.bind(this));
            }
        }.bind(this));
    };

    /**
     * Checks if the searchTerm {id} matches any node on the Tree
     * @param root
     * @param searchTerm
     * @returns {Array}
     */
    var _matchedChildren = function(root, searchTerm){

        var pattern = _createRegexPattern("^"+searchTerm),
            result = [];

        root.children.forEach(recursiveSearch);

        function recursiveSearch(d){

            if (d.name.match(pattern) !== null) {
                result.push(d);
            }

            if (d.children){
                d.children.forEach(recursiveSearch, this);
            } else if (d._children){
                d._children.forEach(recursiveSearch, this);
            }
        }

        return result;
    };

    /**
     * Calculates the root path for a particular node
     * @param d
     * @returns {string}
     */
    var _getNodePath = function(d) {
        var path = [],
            parent = d;

        while (parent !== undefined) {
            if(parent.name === "/"){
                path.push("/");
            }
            else{
                path.push(parent.name + "/");
            }
            parent = parent.parent;
        }
        if(path.length > 0){
            var lastChild = path[0].slice(0, - 1);
            path[0] = lastChild;
        }
        return path.reverse().join("");
    };

    /**
     * Implement Search functionality
     * @param root
     * @private
     */
    var _search = function(nav, root){

        var searchTerm = nav.pathText.trim(),
            foundChildren = _matchedChildren(root, searchTerm);

        var list = foundChildren.map(function(d){
            return _getNodePath(d);
        });

        nav.pathText = searchTerm;

        if(list.length > 0){
            nav.result.children = list;
            _showList(nav, list);
        } else {
            this.destroyList();
        }
    };

    /**
     * Filter out list items in the list based on the path entered on the nav
     * @param nav
     * @private
     */
    var _filterList = function (nav){
        this.destroyList();
        var path = nav.pathText,
            items = nav.result.children,
            filteredItems = [];

        items.forEach(function(item){
            if(item.toLowerCase().indexOf(path.toLowerCase()) >= 0){
                filteredItems.push(item);
            }
        });

        if(filteredItems.length > 0){
            _showList(nav, filteredItems);
        }
    };

    /**
     * Display search results
     * @param nav
     * @param items
     * @private
     */
    var _showList = function(nav, items){
        if(_list) _list.destroy();
        _list = new nav.list({name: "Results", items: items, nav: nav});
        _list.attachTo(nav.parentView);
    };

    /**
     * Get next listItem
     * @param list
     * @param visItems
     * @returns {*}
     * @private
     */
    var _nextItem = function(list, visItems){
        _nextIndex = list.getIndex() + 1;
        var next = visItems.slice(_nextIndex)[0];
        if(!next) _nextIndex = -1;
        return next;
    };

    /**
     * Get previous listItem
     * @param list
     * @param visItems
     * @returns {*}
     * @private
     */
    var _previousItem = function(list, visItems){
        _previousIndex = list.getIndex() -1;
        if(_previousIndex <= -1){
            _previousIndex = visItems.length;
        }
        var prev = visItems.slice(_previousIndex)[0];
        if(!prev) _previousIndex = visItems.length;
        return prev;
    };

    /**
     * Get current listItem
     * @param list
     * @param visItems
     * @returns {*}
     * @private
     */
    var _currentItem = function(list, visItems){
        _currentIndex = list.getIndex();
        var current = visItems.slice(_currentIndex)[0];
        if(!current) _currentIndex = -1;
        return current;
    };

    return {

        openTree: function(_root){
            _openTreePath.call(this, _root);
        },

        keyBoardEvents: function(e, nav, _root) {
            if(_list){
                var keyCode =  e.originalEvent.keyCode;
                _listItems = _list.view.getNavBarResultItems();
                if(keyCode){
                    switch (keyCode){
                        case _keys.ENTER:{
                            _openTreePath.call(nav, _root);
                            _filterList.call(this, nav);
                            nav.path.trigger("blur");
                        }break;
                        case _keys.ESCAPE:{
                            nav.path.trigger("blur");
                        }break;
                        case _keys.DOWN:{
                            e.preventDefault();
                            var next = _nextItem(_list, _listItems);
                            _current = _currentItem(_list, _listItems);

                            if(next){
                                nav.path.setValue(next.getText());
                                nav.pathText = nav.path.getValue() + "/";
                                next.setModifier("selected");
                            } else{
                                nav.path.setValue(nav.lastPathValue);
                            }
                            if(_current && _current !== next) _current.removeModifier("selected");
                            _list.setIndex(_nextIndex);
                            _adjustScroll.call(nav, _nextIndex);
                        }break;
                        case _keys.UP:{
                            e.preventDefault();
                            var prev = _previousItem(_list, _listItems);
                            _current = _currentItem(_list, _listItems);

                            if(prev){
                                nav.path.setValue(prev.getText());
                                nav.pathText = nav.path.getValue() + "/";
                                prev.setModifier("selected");
                            } else{
                                nav.path.setValue(nav.lastPathValue);
                            }
                            if(_current && _current !== prev) _current.removeModifier("selected");
                            _list.setIndex(_previousIndex);
                            _adjustScroll.call(nav, _previousIndex);
                        }
                    }
                }
            }
        },

        fetchList : function(nav, _root){

            nav.enterButton.setAttribute("disabled", true);

            if(nav.path._getHTMLElement().checkValidity()){

                var path = _createRegexPattern("^(\/{1})+([\\w\\-#]+\/?)*$|^(\\s*)+[\\w\\-#]*$");

                //Todo Create a regex Extension - Used by wProperties and wNavBar
                var value = nav.path.getValue(),
                    filePath = _createRegexPattern("^\/$|^(\/{1}[\\w\\-#]+)+(\/?)$"),
                    basicString = _createRegexPattern("^(\\s?)+[\\w\\-#]+$");

                nav.pathText = value;
                nav.lastPathValue = value;
                nav.cancelButton.setModifier("show");

                if(value.match(filePath) && nav.path._getHTMLElement().checkValidity()) {
                    nav.enterButton.setAttribute("disabled", false);
                    nav.enterButton.setAttribute("title", "Open Tree Path");

                    _getList.call(nav, _root)
                        .done( function () {
                            _filterList.call(this, nav);
                        }.bind(this))
                        .fail( function (e) {
                            //TODO this should be displayed to the user!
                            console.log("Invalid path", e);
                        });

                } else if(value.match(basicString)) {

                    nav.enterButton.setAttribute("title", "Search Deployment Model");
                    _search.call(this, nav, _root);

                } else {
                    if(value.length === 0){
                        nav.cancelButton.removeModifier("show");
                    }
                    this.destroyList();
                }
            }else {
                this.destroyList();
            }
        },

        clearSearch: function(nav){
            nav.cancelButton.removeModifier("show");
            nav.path.setValue('');
            this.destroyList();
            nav.path.trigger('focus');

        },

        destroyList : function () {
            if(_list) _list.destroy();
        }
    };
});