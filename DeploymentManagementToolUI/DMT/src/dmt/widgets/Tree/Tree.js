define([
    'jscore/core',
    'jscore/ext/net',
    "./TreeView",
    "jscore/base/jquery",
    "./../../ext/D3/d3",
    "./../../ext/Tree/DrawTree",
    "./../../ext/Tree/ParseJSONData",
    "./../../ext/Tree/TreeLayout",
    "./../../ext/Tree/TreeUtils",
    "./../../ext/Zoom/Zoom",
    "./../../ext/CRUD/CRUD",
    "./../../ext/Tree/ItemTypeParser",
    "./../Loader/Loader",
    "./../../ext/Storage/Reader",
    "./../../ext/CRUD/PayloadParser"

], function (core, net, View, $, d3, DRAW, JSON_PARSER, Layout, UTILS, Zoom, CRUD, ITEM_PARSER, Loader, READER, PAYLOAD_PARSER) {
    var _eventBus, _parent, _view;
    var _loader = new Loader();
    var _workingCopyId = 0;

    /**
     * Setup Zoom Event on the Tree
     * @private
     */
    var _setupZoomEvent = function() {
        this.zoomScale = {min: 1, max: 1.5};

        //Initialize zoom behaviour from d3
        this.zoom = d3.behavior
            .zoom()
            .x(this.x)
            .y(this.y)
            .scaleExtent([this.zoomScale.min,this.zoomScale.max]);

        //Call the zoom behaviour and attach it to the SVG, setup its' event configuration
        this.svgRoot
            .call(this.zoom.on("zoom", UTILS.redraw(this, _eventBus)))
            .on("click.drag", null)
            .on("click.zoom", null)
            .on("dblclick.zoom",null)
            .on("mouseup.drag", UTILS.mouseup.call(this));

        this.zoomEvent = Zoom;

    };

    /**
     * binds the root object to a custom event called "loadTree"
     * @private
     */
    var _setupTreeLoadEvent = function(){
        var event = new CustomEvent("loadTree",{"detail":{"data":this.root}});
        this.view.getElement().element.dispatchEvent(event);
    };

    var _fetchChildren = function(parent){
        var deferred = $.Deferred();

        var childURI = PAYLOAD_PARSER.getResourceLinkByKey(parent, "children");

        var request = CRUD.get(childURI,
            function(response){
                this.removeTreeLoader();
                deferred.resolve(response);
            }.bind(this),
            this.removeTreeLoader);

        if(request.getReadyState() === 1) this.addTreeLoader();

        return deferred.promise();
    };

    //TODO do I need this?
    var _getChildren = function(response, d) {
        this.removeTreeLoader();
        var result = JSON_PARSER.getParsedLandscape(response.children);
        d.children = result.children;
        d._children = null;

        d.children.forEach(function(child, index){
            child.hasChildren = response.children[index].children;
            child.links = response.children[index].links;
        }.bind(this));

        //updates the node plus and minus button
        UTILS.setNodeState(d);

        this.drawTree.updateTree.call(this, d);
    };

    /**
     *
     * @param parent
     * @param childName
     * @param path
     * @private
     */
    var _addChildToParent = function(parent, childName, parent_path){
        var retrievedChildren;
        if(parent.children){
            retrievedChildren = _fetchChildren.call(this, parent);
            retrievedChildren.done(function(response){
                //Parse Children
                var parsed_children = UTILS.parseChildren(response.children);
                var child_to_add = UTILS.getChildByName(parsed_children, childName);

                //Pre Parent Update
                parent.children.push(child_to_add);

                //Open Branch
                DRAW.updateTree.call(this, parent);

                //Select Child Label
                var child = UTILS.getChildByName(parent.children, childName);
                this.treeEvents.labelFn(child);

            }.bind(this));
        } else if (parent._children){
            retrievedChildren = _fetchChildren.call(this, parent);
            retrievedChildren.done(function(response){
                //Parse Children
                var parsed_children = UTILS.parseChildren(response.children);
                var child_to_add = UTILS.getChildByName(parsed_children, childName);

                //Pre Parent Update
                parent._children.push(child_to_add);

                //Open Branch
                this.treeEvents.nodeFn(parent);

                //Select Child Label
                var child = UTILS.getChildByName(parent.children, childName);
                this.treeEvents.labelFn(child);

            }.bind(this));
        } else if (!parent.children && !parent._children){
            if(parent.hasChildren === true || parent.hasChildren === false){
                retrievedChildren = _fetchChildren.call(this, parent);
                retrievedChildren.done(function(response){

                    //Parse Children and add to Parent
                    parent._children = UTILS.parseChildren(response.children);
                    parent.children = null;
                    parent.hasChildren = true;

                    //Open Branch
                    this.treeEvents.nodeFn(parent);

                    //Select Child Label
                    var child = UTILS.getChildByName(parent.children, childName);
                    this.treeEvents.labelFn(child);

                }.bind(this));
            } else if(parent.hasChildren === undefined || parent.hasChildren === null){
                alert("Houston, we definitely have a problem!");
            }
        }
    };

    var _getWorkingCopy = function(id){
        return READER.getWorkingCopy(id);
    };

    //CRUD Response functions
    var _loadTree = function(response){
        var parsed_json = JSON_PARSER.getParsedLandscape(response.children);

        //Create Tree Container
        Layout.renderTree.call(this, parsed_json);

        this.root.children.forEach(function(child, index){
            this.collapseAllChildrenNodes(child);
            child.hasChildren = response.children[index].children;
            child.links = response.children[index].links;
        }.bind(this));

        this.drawTree = DRAW;
        this.drawTree.updateTree.call(this, this.root);

        //Setup Zoom Event Handlers
        _setupZoomEvent.call(this);

        //Pass the Root using the EventBus
        _setupTreeLoadEvent.call(this);

        //Limits the panning of the Tree
        UTILS.keepTreeInView(this);
        this.repositionTree();

        _eventBus.publish("propertyInfo", {type:"Ok"});
        _loader.detach();
    };

    var _loadTreeError = function(response){
        //Todo get the status code & description
        var res = response;

        //Todo use HTTP status code - check this
        var errorType = {type:"Internal Server Error"};
        _eventBus.publish("propertyInfo", errorType);
        _loader.detach();
    };

    var _loadProperties = function(response) {

        this.d.path = response.path;

        _eventBus.publish("removeLoaderFromPropPanel");
        var selfURI = PAYLOAD_PARSER.getResourceLinkByKey(response, "self");

        var event = new CustomEvent("clickNodeLabel",{"detail":{"URL":selfURI, "path":response.path, "type": response.type, "properties":response, "NODE":this.d }});
        this.view.getElement().element.dispatchEvent(event);
    };

    var _loadPropertiesError =  function(){
        _eventBus.publish("removeLoaderFromPropPanel");
        var errorType = {type:"Internal Server Error"};
        _eventBus.publish("propertyInfo", errorType);
        _loader.detach();
    };

    return core.Widget.extend({

        View: View,

        onViewReady: function(options) {

            _workingCopyId = options.wc;
            _view = this.view;
            _eventBus = options.eventBus;
            _parent = this.view.getElement();

            this.populateTreeRoot();
        },

        populateTreeRoot:function(){

            var wc = _getWorkingCopy(_workingCopyId),
                childrenURI = PAYLOAD_PARSER.getResourceLinkByKey(wc, "children");

            var request = CRUD.get(childrenURI, _loadTree.bind(this), _loadTreeError);

            if(request.getReadyState() === 1){
                _eventBus.publish("propertyInfo", {type:"Loading"});
                _loader.attachTo(_parent);
            }
        },

        setupMouseEvents: function(){
            var self = this;
            this.treeEvents = {
                nodeFn: function (d) {
                    if (d.depth > 0 && d.hasChildren) {
                        self.expandCollapseChildrenNodes(d);
                        if(d.hasChildren) {

                            d3.selectAll(".eaDMT-wTree-node-gCircle").classed("eaDMT-wTree-node-gCircle-lastClickedNode", false);
                            try{
                                d3.select(this).classed("eaDMT-wTree-node-gCircle-lastClickedNode", true);
                            }catch(e){

                            }
                        }
                    }
                },

                labelFn: function (d) {
                    if(d.depth !== 0){
                        //Remove highlight from all nodes
                        d3.selectAll("circle").classed("selected", false);

                        this.d = d;

                        //Discover path from child to root
                        UTILS.filterPath.call(this, d);
                        UTILS.mapPath.call(this, this.ancestors);

                        var selfURI = PAYLOAD_PARSER.getResourceLinkByKey(d, "self");

                        var request = CRUD.get(selfURI, _loadProperties.bind(this), _loadPropertiesError);

                        if(request.getReadyState() === 1){
                            _eventBus.publish("labelClicked", {type:"Loading"});
                            _eventBus.publish("addLoaderInPropPanel");
                        }
                    }
                }.bind(this)
            };
            this.nodeEnterGroup
                .on("click", this.treeEvents.nodeFn);

            this.nodeGroup.selectAll(".eaDMT-wTree-node-textLabel")
                .on("click", this.treeEvents.labelFn);
        },

        expandCollapseChildrenNodes: function(d) {
            //Closes children
            if (d.children) {
                d._children = d.children;
                d.children = null;

                UTILS.setNodeState(d);

                this.drawTree.updateTree.call(this, d);
            } else {
                //Opens Children (creates url from root to the selected node, for example "/infrastructure/network/"
                if (d._children === undefined) {



                    var childrenURI = PAYLOAD_PARSER.getResourceLinkByKey(d, "children");

                    var request = CRUD.get(childrenURI, function(response){
                        _getChildren.call(this, response, d);
                    }.bind(this), this.removeTreeLoader);
                    if(request.getReadyState() === 1){
                        this.addTreeLoader();
                    }
                }
                else{
                    this.expandChildrenNodes(d);
                }
            }
        },

        addTreeLoader: function() {
            _view.fadeTreeSvg();
            _loader.attachTo(_parent);
        },

        removeTreeLoader: function() {
            _view.unfadeTreeSvg();
            _loader.detach();
        },

        collapseAllChildrenNodes: function(d){
            d.selected = false;
            if (d.children) {
                //d._Children are hidden, d.Children are visible
                d._children = d.children;

                for(var i in d._children){
                    this.collapseAllChildrenNodes(d._children[i]);
                }

                d.children = null;
            }
        },

        expandChildrenNodes: function (d){
            //Called by NavigationWidget via the eventBus
            if (!d.children) {
                d.children = d._children;
                d._children = null;
            }
            d3.selectAll(".eaDMT-wTree-node-gCircle-path-linkUnderline2")
                .classed("eaDMT-wTree-node-gCircle-path-linkUnderline2_showing", function (d) {
                    if(d._children === undefined){
                        return d.hasChildren;
                    } else {
                        return !d.children;
                    }
                });
            this.drawTree.updateTree.call(this, d);
        },

        panRight: function () {
            var x = UTILS.getX(this, this.root);
            var y = UTILS.getY.call(this, this.root);
            x = x-100;
            this.zoom.translate([x, y]); // resets scales of pan
            this.drawTree.updateTree.call(this, this.root);  //updates everything after translation of tree
        },

        panLeft: function () {
            var x = UTILS.getX(this, this.root);
            var y = UTILS.getY.call(this, this.root);
            x = x + 100;
            this.zoom.translate([x, y]); // resets scales of pan
            this.drawTree.updateTree.call(this, this.root);  //updates everything after translation of tree
        },

        repositionTree: function() {
            this.zoom.scale(1);      //zoom in by scale 1 (lowest zoom= 1 max zoom = 3
            var treeViewHeight = this.size.height;
            if(treeViewHeight <= 600){
                this.zoom.translate([25, treeViewHeight/2 - this.root.x]); // resets scales of pan
            } else {
                this.zoom.translate([25, treeViewHeight/2 - this.root.x - 40]); // resets scales of pan
            }
            this.zoomLevel = this.zoom.scale();

            //Event Triggers Zoom Slider Update on the ZoomWidget
            _eventBus.publish("treeZoom", this);

            this.drawTree.updateTree.call(this, this.root);
        },

        zoomIn: function() {
            this.zoomEvent.zoomIn.call(this);
        },

        zoomOut: function() {
            this.zoomEvent.zoomOut.call(this);
        },

        zoomSlider: function(value) {
            this.zoomEvent.zoomSlider.call(this, value);
        },

        updateTree: function (source) {
            DRAW.updateTree.call(this, source);
        },

        removeChild: function (d) {
            if(d){
                var childIndex = 0;
                for(var key in d.parent.children){
                    if(d.parent.children.hasOwnProperty(key)){
                        if(d.name === d.parent.children[key].name){
                            childIndex = key;
                        }
                    }
                }
                d.parent.children.splice(childIndex,1);

                if(d.parent.children.length === 0) {
                    d.parent.hasChildren = false;
                    d.parent.children = null;
                    d.parent._children = null;
                }

                DRAW.updateTree.call(this, d.parent);
                this.treeEvents.labelFn(d.parent);
            }
        },

        addChild: function(source) {
            var childName = source.id,
                parent = source.node,
                parent_path = this.pathText;

            if(parent.hasChildren === true || parent.hasChildren === false){
                _addChildToParent.call(this, parent, childName, parent_path);
            }
            else if(parent.hasChildren === undefined){
                alert("Houston, we have a problem!");
            }
        },

        disableClickLabel: function () {
            this.getElement().setModifier("disabled");
            this.view.getSVG().setStyle("pointer-events", "none");
            setTimeout(function(){
                this.bufferFunction();
            }.bind(this),1000);
        },

        enableClickLabel: function () {
            this.getElement().removeModifier("disabled");
            this.view.getSVG().setStyle("pointer-events", "all");
            setTimeout(function(){
                this.bufferFunction();
            }.bind(this),1000);
        }
    });
});
