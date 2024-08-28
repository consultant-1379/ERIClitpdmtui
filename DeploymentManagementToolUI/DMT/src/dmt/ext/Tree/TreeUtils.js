define([
    "./../D3/d3",
    "jscore/base/jquery",
    "jscore/ext/utils/base/underscore"

], function(d3, $, _){

    var _treeWidth = 300;

    return{

        /**
         * returns the appropriate width for the Tree SVG element
         * @returns {number}
         */
        setTreeWidth: function (number) {
            _treeWidth = number;
        },

        svgWidth: function(){
            if ((window.innerWidth - _treeWidth - 166) < 684) {
                return 684;
            }
            return window.innerWidth - _treeWidth - 166;
        },

        /**
         * Normalizes the node label length on each depth of the tree,
         * Goes through each node, gets the width of its' label and compares it to nodes on the same depth.
         * Sets each node label on the same depth to the maximum node label width found.
         *
         * i.e. { Depth:1, Node1.labelLength = 10, Node2.labelLength = 12 }
         *      Call normalizeMaxLabelLength();
         *
         *      Result --> { Depth:1, Node1.maxLabelLength = 12, Node2.maxLabelLength = 12 }
         */
        normalizeMaxLabelLength: function(){
            //Have to create a temporary text field on the page to get the computed text length
            //It is then removed and stored in the object itself as d.labelLength
            var maxDepth = [];
            this.nodes.forEach(function (d){
                var currentDepth = d.depth,
                    labelHolder = null;
                if(d.depth === currentDepth){
                    maxDepth.push(currentDepth);
                }
                if(labelHolder){
                    labelHolder.empty();
                }
                labelHolder = $('.eaDMT-wTree-labelHolder').text(d.name);
                var el = $(labelHolder);
                d.labelLength = el.width() + 10;
                labelHolder.empty();
            });

            //Get unique depths in the tree
            var uniqueDepth = _.uniq(maxDepth).sort(),
                nodesWithNewDepth = [];

            uniqueDepth.forEach(function(){
                nodesWithNewDepth.push([]);
            });
            //Add all the label lengths corresponding to their depth level to the array
            this.nodes.forEach(function(d) {
                nodesWithNewDepth[d.depth].push(d.labelLength);
            });
            //Get the Maximum depth of each label in all of the open nodes and it to an array
            var maxLabelLengthList = [];
            nodesWithNewDepth.forEach(function(i){
                var largest = Math.max.apply(Math, i);
                maxLabelLengthList.push(largest);
            });
            //Add MaxLabelLength to the corresponding labels at their respective depths
            this.nodes.forEach(function (d){
                d.maxLabelLength = maxLabelLengthList[d.depth];
            });
            this.nodes.forEach(function (d){
                d.maxLabelLengthList = maxLabelLengthList;
                d.offsetLabel = d.maxLabelLength;
            });
        },

        /**
         * Provides the nodes on the tree with correct spacing
         * taking into account the node labels width.
         * @param d - currently selected node from the tree
         * @return {number}
         */
        getNodeXPosition: function(d){
            var nodeXPosition = 0,
                depth = d.depth+1;
            for(var i= 0; i< depth ;i++){
                nodeXPosition += d.maxLabelLengthList[i];
            }
            return nodeXPosition;
        },

        /**
         * Creates the highlighted path on the tree view
         * from the currently selected node label "d".
         * @param d - currently selected node from the tree
         */
        filterPath: function(d){
            // Walk parent chain
            this.ancestors = [];
            this.ancestorsNames = [];
            var parent = d;
            while (parent !== undefined) {
                this.ancestorsNames.push(parent.name);
                this.ancestors.push(parent);
                parent = parent.parent;
            }
            var lastChildSelected = this.ancestorsNames;

            //Loops through all nodes and sets "selected" attribute to false
            function resetSelection(d){
                d.selected = false;
                var children = d.children ? d.children : d._children;
                if (children) {
                    children.forEach(resetSelection);
                }
            }

            this.root.children.forEach(resetSelection);

            //Select all paths and removes the class "selected"
            this.layoutRoot.selectAll(".eaDMT-wTree-node-gCircle-path")
                .classed("eaDMT-wTree-node-gCircle-path-linkUnderline_selected",false);

            //Get all Node Text Labels and Filter them out, this is based on the selected child path to the root.
            this.layoutRoot.selectAll(".eaDMT-wTree-node-textLabel")
                .each(function(d){
                    //Clear all selected node labels
                    d.selected = false;
                })
                .classed("eaDMT-wTree-node-textLabel_selected",false)
                .filter(function(d)
                {
                    return _.any(this.ancestors, function(p)
                    {
                        return p.id === d.id;
                    });
                }.bind(this))
                .each(function(d)
                {
                    //Apply selected to the node
                    d.selected = true;
                    //Apply highlighting to text label
                    d3.select(this).classed("eaDMT-wTree-node-textLabel_selected",true);
                });
            //Get all Node Circles and Filter them based on the selected child path to the root.
            this.layoutRoot.selectAll(".eaDMT-wTree-node circle")
                .classed("eaDMT-wTree-node-gCircle-circle_selected",false)
                .filter(function(d)
                {
                    return _.any(this.ancestors, function(p)
                    {
                        return p.id === d.id;
                    });
                }.bind(this))
                .each(function()
                {
                    //Apply highlighting to node circle only if it is not the last one
                    if(d.name !== this.parentElement.nextSibling.textContent){
                        if(lastChildSelected.indexOf(this.parentElement.nextSibling.textContent)>0){
                            d3.select(this)
                                .classed("eaDMT-wTree-node-gCircle-circle_selected",true);
                            $(d3.select(this)[0]).siblings().each(function(){
                                d3.select(this).classed("eaDMT-wTree-node-gCircle-path-linkUnderline_selected",true);
                            });
                        }
                    }
                });

            //Get all Path Links and Filter them out based on the selected child to parent.
            this.layoutRoot.selectAll(".eaDMT-wTree-link")
                .classed("eaDMT-wTree-link_selected",false)
                .filter(function(d)
                {
                    return _.any(this.ancestors, function(p)
                    {
                        return p === d.target;
                    });
                }.bind(this))
                .classed("eaDMT-wTree-link_selected","true");

        },

        /**
         * Displays the path of the tree in text form in the Navigation Bar.
         * Takes in ancestors converts from an array and converts to a format that is readable.
         * @param ancestors - created in the filterPath()
         */
        mapPath: function(ancestors){
            //This section of code is used to display the path of the tree
            var pathString = "";
            var linksAncestors = ancestors.reverse();
            var length = linksAncestors.length - 1;
            var lastObject = linksAncestors[length].name + "/";

            if (linksAncestors[length].name === "/"){
                lastObject = linksAncestors[length].name;
            }

            //Cuts last object off linkAncestors as it is is now placed in lastObject
            linksAncestors.pop();

            for (var index in linksAncestors) {
                pathString += linksAncestors[index].name + "/";
            }
            //This function is used to remove the "/"
            this.deleteCharAt = function( str, index )
            {
                return str.substring( 0, --index ) + str.substring( ++index );
            };

            //Condition put here in case the root node is not "/"
            if (typeof linksAncestors[0] === 'undefined' || linksAncestors[0].name === "/") {
                pathString =  ( this.deleteCharAt( pathString, 2 ) );
            }
            var path = $(".eaDMT-wNavigation input");
            path.val(pathString + lastObject);
            this.pathText = path.val();
        },

        /**
         * Change the mouse cursor to a custom mouse drag symbol
         * @return {Function}
         */
        plot_drag: function() {
            return function() {
                //Prevents the cursor change to text style
                d3.event.preventDefault();
                document.onselectstart = function() { return false; };
                $(".eaDMT-wNavigation input").blur();
                //Change cursor to hand drag
                d3.select('.eaDMT-wTree').style("cursor", "url('data:image/gif;base64,AAACAAEAICACAAcABQAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAA/AAAAfwAAAP+AAAH/gAAB/8AAAH/AAAB/wAAA/0AAANsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////gH///4B///8Af//+AD///AA///wAH//+AB///wAf//4AH//+AD///yT/////////////////////////////8='), move");
            };
        },

        /**
         * Reset the mouse cursor when drag is released
         * @return {*}
         */
        mouseup: function() {
            return function() {
                document.onselectstart = function() { return true; };
                d3.select('body').style("cursor", "auto");

                //Rebind the event click handler when mouseup after redraw function
                setTimeout(function(){
                    this.nodeGroup.selectAll(".eaDMT-wTree-node-textLabel")
                        .on("click", this.treeEvents.labelFn);
                    this.nodeGroup.selectAll(".eaDMT-wTree-node-gCircle")
                        .on("click", this.treeEvents.nodeFn);
                }.bind(this),100);
            }.bind(this);
        },

        /**
         * Used by Zoom functions to redraw the nodes and links progressively - prevents stutter in rendering
         * @param TREE
         * @return {*}
         */
        redraw: function(TREE, eventBus) {
            return function() {
                //gets the current zoom level of the zooming by "mouse wheel" and passes it into the zoomLevelIndicator function
                if (d3.event.sourceEvent.type==='mousewheel' || d3.event.sourceEvent.type==='DOMMouseScroll' || d3.event.sourceEvent.type==='wheel'){
                    eventBus.publish("treeZoom", TREE);
                }
                else{
                    //Remove event click handler when redraw is being called
                    TREE.nodeGroup.selectAll(".eaDMT-wTree-node-textLabel")
                        .on("click", null);
                    TREE.nodeGroup.selectAll(".eaDMT-wTree-node-gCircle")
                        .on("click", null);
                }
                TREE.nodeGroup.attr("transform", function(d){
                    return this.transform.call(TREE, d);
                }.bind(this));
                TREE.linkGroup.attr("d", TREE.diagonal);
            }.bind(this);
        },

        /**
         * For each node, their respective coordinates are updated
         * @param d
         * @return {string}
         */
        transform: function(d) {
            //Moves the nodes position, used by zoom function
            var sourceY = this.x(d.y);
            var sourceX = this.y(d.x);
            return "translate(" + sourceY + "," + sourceX + ")";
        },

        /**
         * Used by panning functions to get node's X coordinate
         * @param TREE
         * @param d
         * @return {number}
         */
        getX: function(TREE, d) {
            var sourceX = TREE.x(d.y) + this.getNodeXPosition(d);
            return sourceX;
        },

        /**
         * Used by panning functions to get node's Y coordinate
         * @param d
         * @return {*}
         */
        getY: function(d) {
            var sourceY = this.y(1);
            return sourceY;
        },

        /**
         * Returns a child if matches the Param 'name' provided by the call
         * @param parent
         * @param name
         * @returns {*}
         */
        getChildByName: function(children, name){
            var child = children.filter(function(child){
                return child.name === name;
            });
            return child[0];
        },

        getChildren: function(parent){
            return parent.children ? parent.children : parent._children;
        },

        /**
         * This function is called in the updateTree function and its purpose is to dynamically space out the tree
         * nodes to avoid the issue of overlapping nodes and labels. The spacing is calculated on the basis of the
         * number of nodes that are currently open on view.
         *
         * @param noOfOpenNodes
         * @param nodeRadius
         */
        nodeSpace: function (noOfOpenNodes, nodeRadius) {
            var buffer = 1.5;
            var nodeSpacing = (nodeRadius * 2) + buffer;
            var newHeight = nodeSpacing * noOfOpenNodes;

            if(newHeight <= this.size.height) {
                this.tree = this.tree.size([this.size.height, this.size.width]);
            } else {
                this.tree = this.tree.size([newHeight, this.size.width]);
            }
        },

        /**
         * This function prevents the tree from being panned out of view. A buffer is set which prevents the tree
         * from getting any closer to the edge of the view.
         */
        keepTreeInView: function(TREE) {
            var treeView = TREE.view.getElement();

            TREE.bufferFunction = function(){
                var treeViewWidth = treeView.element.clientWidth;
                var buffer = 250;
                // Boundary Box dimensions and coordinates
                var bBox = TREE.svgRoot.node().getBBox();
                var treeX = bBox.x;
                var treeY = bBox.y;
                var treeWidth = bBox.width;
                var treeHeight = bBox.height;

                // Tree view dimensions
                var viewHeight = TREE.size.height;

                var rootX = this.getX(TREE, TREE.root);
                var rootY = this.getY.call(TREE, TREE.root);
                var top = treeY + treeHeight - buffer < -5;
                var left = treeX + treeWidth - buffer < -5;
                var bottom = treeY + buffer > viewHeight + 40;
                var right = treeX + buffer > treeViewWidth + 5;
                var root = TREE.root;

                if(top && left){
                    TREE.zoom.translate([-treeWidth + buffer, rootY - treeY - treeHeight + buffer]);
                    TREE.drawTree.updateTree.call(TREE, root);
                } else if(bottom && left){
                    TREE.zoom.translate([-treeWidth + buffer, viewHeight - buffer]);
                    TREE.drawTree.updateTree.call(TREE, root);
                } else if(top && right){
                    TREE.zoom.translate([(treeViewWidth - buffer), rootY - treeY - treeHeight + buffer]);
                    TREE.drawTree.updateTree.call(TREE, root);
                } else if(bottom && right){
                    TREE.zoom.translate([(treeViewWidth - buffer), viewHeight - buffer]);
                    TREE.drawTree.updateTree.call(TREE, root);
                }
                else if(top){
                    TREE.zoom.translate([rootX - 17, rootY - treeY - treeHeight + buffer]);
                    TREE.drawTree.updateTree.call(TREE, root);
                } else if(bottom) {
                    TREE.zoom.translate([rootX - 17, viewHeight - buffer]);
                    TREE.drawTree.updateTree.call(TREE, root);
                } else if(left) {
                    TREE.zoom.translate([-treeWidth + buffer, rootY]);
                    TREE.drawTree.updateTree.call(TREE, root);
                } else if(right) {
                    TREE.zoom.translate([(treeViewWidth - buffer), rootY]);
                    TREE.drawTree.updateTree.call(TREE, root);
                }
                treeView.setStyle("cursor", "auto");
            }.bind(this);

            treeView
                .addEventHandler("mousewheel", function() {
                    treeView.setStyle("cursor", "auto");
                    TREE.bufferFunction();
                });
            treeView
                .addEventHandler("wheel", function() {
                    treeView.setStyle("cursor", "auto");
                    TREE.bufferFunction();
                });

            d3.select('html').on("mouseup.drag", TREE.bufferFunction);

        },

        /**
         * Set the Node State either + or -
         * @param d
         */
        setNodeState: function(d) {

            /*d3.select("g#"+ d.name)
             .select(".eaDMT-wTree-node-gCircle-path-linkUnderline2")
             .classed("eaDMT-wTree-node-gCircle-path-linkUnderline2_showing", function () {
             if(d._children === undefined){
             return d.hasChildren;
             } else {
             return !d.children;
             }
             });*/

            //Todo this inefficient searches the whole tree
            d3.selectAll(".eaDMT-wTree-node-gCircle-path-linkUnderline2")
                .classed("eaDMT-wTree-node-gCircle-path-linkUnderline2_showing", function (d) {
                    if(d._children === undefined){
                        return d.hasChildren;
                    } else {
                        return !d.children;
                    }
                });
        },

        /**
         *
         * @param child
         * @returns {Array|*}
         */
        childHasChildren: function(children, childName, childNode) {
            for(var child in children){
                if(children.hasOwnProperty(child)){
                    if(child === childName){
                        childNode.hasChildren = children[child].children;
                    }
                }
            }
        },

        parseChildren: function(children) {
            return children.map(function(child){
                child.hasChildren = child.children;
                child.name = child.id;
                delete child.id;
                delete child.children;
                return child;
            });
        },

        /**Overriding d3.svg.diagonal function**/
        d3_diagonal: function(){
            var source =  d3_source, target = d3_target, projection = d3_svg_diagonalProjection;

            function d3_target(d) {
                return d.target;
            }
            function d3_source(d) {
                return d.source;
            }
            function d3_svg_diagonalProjection(d) {
                return [ d.x, d.y ];
            }

            function diagonal(d, i) {
                var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
                    x: p0.x,
                    y: m
                }, {
                    x: p3.x,
                    y: m
                }, p3 ];
                p = p.map(projection);
                var nodeXPosition = d.target.maxLabelLength;
                if(!isNaN(nodeXPosition)){
                    p[0][0] = p[0][0];
                    p[1][0] = p[1][0] - nodeXPosition / 2;
                    p[2][0] = p[2][0] - nodeXPosition / 2;
                    p[3][0] = p[3][0] - nodeXPosition;
                }
                return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
            }
            diagonal.source = function(x) {
                if (!arguments.length) return source;
                source = d3.functor(x);
                return diagonal;
            };
            diagonal.target = function(x) {
                if (!arguments.length) return target;
                target = d3.functor(x);
                return diagonal;
            };
            diagonal.projection = function(x) {
                if (!arguments.length) return projection;
                projection = x;
                return diagonal;
            };
            return diagonal;
        }
    };
});