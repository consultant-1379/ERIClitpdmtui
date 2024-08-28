define([
    "./../D3/d3",
    "./TreeUtils"
],function(d3, TreeUtils) {
    /**
     * Create, Update, Remove Nodes
     * @param source
     * @private
     */
    var _nodeRadius = 7;
    var _updateNodes = function(source){
        // updateTree the nodes…select all nodes and apply an ID if it doesn't already have one
        this.nodeGroup = this.layoutRoot.selectAll(".eaDMT-wTree-node")
            .data(this.nodes, function (d) {
                d.y = d.depth * 90;
                return d.id || (d.id = ++this.i);
            }.bind(this));

        // Enter any new nodes at the parent's previous position,
        // this includes the function to use the dynamic width of each node.
        // Called when the nodes are created.
        this.nodeEnter = this.nodeGroup.enter().append("g")
            .attr("class", "eaDMT-wTree-node")
            /*.attr("id", function(d){
                return d.name;
            })*/
            .attr("transform", function (d) {
                var update_dy = this.x(source.y0) + TreeUtils.getNodeXPosition(d),
                    update_dx = this.y(source.x0);
                if(d.depth !== 0){
                    update_dy = this.x(source.y0);
                }
                return "translate(" + update_dy + "," + update_dx + ")";
            }.bind(this))
            .classed("eaDMT-wTree-node-root", function (d) {
                return d.depth === 0;
            });

        this.nodeEnterGroup = this.nodeEnter.append("g")
            .attr("class","eaDMT-wTree-node-gCircle")
            .classed("eaDMT-wTree-node-gCircle_empty", function (d) {
                return d.hasChildren === false;
            });

        this.nodeEnterGroup.append("circle")
            .attr("r", _nodeRadius)
            .attr("class","eaDMT-wTree-node-gCircle-circle")
            .classed("eaDMT-wTree-node-gCircle-circle_empty", function (d) {
                return d.hasChildren === false;
            })
            .classed("eaDMT-wTree-node-gCircle-circle_selected", function(d){
                var classed = false;
                var children = d.children ? d.children : d._children;
                if(children){
                    children.forEach(function(child){
                        if(child.selected === true){
                            classed = true;
                        }
                    });
                }
                return classed;
            });

        this.nodeEnterGroup.append("path")
            .attr("class", "eaDMT-wTree-node-gCircle-path-linkUnderline")
            .attr("d", this.lineFunction(this.nodeOpen))
            .classed("eaDMT-wTree-node-gCircle-path", true)
            .classed("eaDMT-wTree-node-gCircle-path-linkUnderline_selected", function(d){
                var classed = false;
                var children = d.children ? d.children : d._children;
                if(children){
                    children.forEach(function(child){
                        if(child.selected === true){
                            classed = true;
                        }
                    });
                }
                return classed;
            });

        this.nodeEnterGroup.append("path")
            .attr("class", "eaDMT-wTree-node-gCircle-path-linkUnderline2")
            .attr("d", this.lineFunction(this.nodeClosed))
            .classed("eaDMT-wTree-node-gCircle-path", true)
            .classed("eaDMT-wTree-node-gCircle-path-linkUnderline2_showing", function (d) {
                if(d._children === undefined){
                    return d.hasChildren;
                } else {
                    return !d.children;
                }
            })
            .classed("eaDMT-wTree-node-gCircle-path-linkUnderline2_selected", function(d){
                var classed = false;
                var children = d.children ? d.children : d._children;
                if(children){
                    children.forEach(function(child){
                        if(child.selected === true){
                            classed = true;
                        }
                    });
                }
                return classed;
            });

        this.nodeEnter.append("text")
            .attr("class","eaDMT-wTree-node-textLabel")
            .attr("x", function (d) {
                var offsetLabel = d.maxLabelLength;
                return -offsetLabel;
            })
            .attr("dy", "0.30em")
            .attr("text-anchor", "start")
            .text(function (d) {
                return d.name;
            })
            .style("fill-opacity", 2e-6)
            .classed("eaDMT-wTree-node-textLabel_selected", function(d){
                return d.selected;
            });

        // Transition/Move nodes to their new positions.
        // Called when the nodes positions are updated.
        this.nodeUpdate = this.nodeGroup.transition()
            .duration(this.duration)
            .attr("transform", function (d) {
                d3.selectAll(".eaDMT-wTree-node-gCircle").each(function(t){
                    d3.select(this).classed("eaDMT-wTree-node-gCircle_empty", function () {
                        return t.hasChildren === false;
                    });
                    d3.select(this).select("circle").classed("eaDMT-wTree-node-gCircle-circle_empty", function () {
                        return t.hasChildren === false;
                    });
                });
                
                d.y = d.y + TreeUtils.getNodeXPosition(d);
                var update_dy = this.x(d.y);
                var update_dx = this.y(d.x);
                return "translate(" + update_dy + "," + update_dx + ")";
            }.bind(this));

        this.nodeUpdate.select("circle")
            .attr("r", _nodeRadius);

        this.nodeUpdate.select("text")
            .style("fill-opacity", _nodeRadius)
            .attr("x", function (d) {
                var offsetLabel = d.maxLabelLength;
                if(d.depth===0){
                    return -12;
                }
                return -offsetLabel;
            });

        // Transition/Move exiting nodes to the parent's new position.
        // Called when the nodes collapse.
        this.nodeExit = this.nodeGroup.exit().transition()
            .duration(this.duration)
            .attr("transform", function (d) {
                d3.selectAll(".eaDMT-wTree-node-gCircle").each(function(t){
                    if(t.name === d.parent.name && t.hasChildren === false){
                        d3.select(this).classed("eaDMT-wTree-node-gCircle_empty", function () {
                            return d.parent.hasChildren === false;
                        });
                        d3.select(this).select("circle").classed("eaDMT-wTree-node-gCircle-circle_empty", function () {
                            return d.parent.hasChildren === false;
                        });
                    }
                });

                var update_dy = this.x(source.y) + TreeUtils.getNodeXPosition(d);
                var update_dx = this.y(source.x);
                if(d.depth !== 0){
                    update_dy = this.x(source.y0);
                }
                return "translate(" + update_dy + "," + update_dx + ")";
            }.bind(this))
            .remove();

        // gradually decreases the circle size when node is being collapsed
        this.nodeExit.select("circle")
            .attr("r", _nodeRadius);

        // gradually makes the text transparent when node is being collapsed
        this.nodeExit.select("text")
            .style("fill-opacity", 2e-6);

        // gradually makes the node path transparent when node is being collapsed
        this.nodeExit.select("path")
            .style("stroke-opacity", 0);
    };

    /**
     * Create, Update, Remove Links
     * @param source
     * @private
     */
    var _updateLinks = function(source){
        // updateTree the links…
        this.linkGroup = this.layoutRoot
            .selectAll(".eaDMT-wTree-link")
            .data(this.tree.links(this.nodes), function (d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        this.linkGroup.enter()
            .insert("path", "g")
            .attr("class", "eaDMT-wTree-link")
            .attr("d", function () {
                var o = {x: source.x0, y: source.y0, depth: source.depth, maxLabelLengthList: source.maxLabelLengthList };
                return this.diagonal({source: o, target: o });
            }.bind(this))
            .classed("eaDMT-wTree-link_selected",function(d){
                return d.target.selected;
            });

        // Transition links to their new position.
        this.linkGroup
            .transition()
            .duration(this.duration)
            .attr("d", this.diagonal);

        // Transition exiting nodes to the parent's new position.
        this.linkGroup.exit().transition()
            .duration(this.duration)
            .attr("d", function () {
                var o = {x: source.x, y: source.y, depth: source.depth, maxLabelLengthList: source.maxLabelLengthList};
                return this.diagonal({source: o, target: o});
            }.bind(this))
            .remove();
    };

    return {

        /**
         * Draws the initial tree and also redraws it when nodes are opened/closed.
         * The tree is also redrawn using this function when the panning and zooming functionality is being used.
         * Binds mouse events to nodes and links in the newly updated tree.
         * @param source
         */
        updateTree: function(source){
            // Compute the new tree layout, from last nodeGroup to parent nodeGroup.
            this.nodes = this.tree.nodes(this.root).reverse();

            // Dynamically separate the nodes to avoid overlapping
            TreeUtils.nodeSpace.call(this, this.nodes.length, _nodeRadius);
            this.nodes = this.tree.nodes(this.root);

            //Normalize labels width, on each level of depth. Takes the widest label and
            //applies the width to all node labels at the same depth of the tree.
            TreeUtils.normalizeMaxLabelLength.call(this);

            var yBefore = this.y(source.x0);

            //updateTree Nodes and Links
            _updateNodes.call(this, source);
            _updateLinks.call(this, source);

            var yAfter = this.y(source.x);
            var x = TreeUtils.getX(this, this.root);  // x coordinate of root node
            var y = TreeUtils.getY.call(this, this.root);  // y coordinate of root node

            if (yAfter - yBefore > 0) {
                this.zoom.translate([x - 17, y - (Math.abs(yAfter - yBefore))]);
                _updateNodes.call(this, source);
                _updateLinks.call(this, source);
            } else if (yAfter - yBefore < 0) {
                this.zoom.translate([x - 17, y + (Math.abs(yAfter - yBefore))]);
                _updateNodes.call(this, source);
                _updateLinks.call(this, source);
            }

            if (d3.event && d3.event.keyCode) {
                d3.event.preventDefault();
                d3.event.stopPropagation();
            }

            // Stash the old/previous positions for transition.
            this.nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            this.setupMouseEvents();
        }
    };
});