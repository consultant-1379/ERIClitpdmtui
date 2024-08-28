define([
    "./../../widgets/Tree/Tree",
    "../../ext/D3/d3",
    "./TreeUtils"
], function (Tree, d3, TreeUtils) {
    return {

        /**
         * Setup Tree Container - SVG Layout
         * @param parsed_json - Tree.root = parsed_json
         */
        renderTree: function(parsed_json) {

            //Setup the Tree Container
            this.margin = {top: 0, right: 0, bottom: 0, left: 5};

            TreeUtils.setTreeWidth(300);

            this.size = {
                "width": TreeUtils.svgWidth(),
                "height": 600 - this.margin.top - this.margin.bottom
            };

            this.i = 0;
            this.duration = 500;
            this.root = parsed_json;
            this.root.x0 = this.size.height / 2;
            this.root.y0 = 0;
            this.root.selected = false;

            //X and Y Coordinates for Scaling the Tree
            this.x = d3.scale.linear()
                .domain([0, this.size.width])
                .range([0, this.size.width]);

            this.y = d3.scale.linear()
                .domain([0, this.size.height])
                .nice()
                .range([0, this.size.height])
                .nice();

            // while mouse button not held down, this.dragged and this.selected are set to null
            this.dragged = this.selected = null;

            //Creates Tree
            this.tree = d3.layout.tree()
                .size([this.size.height, this.size.width]);

            //Renders links
            this.diagonal = TreeUtils.d3_diagonal()
                .projection(function (d) {
                    var update_dy = this.x(d.y),
                        update_dx = this.y(d.x);
                    return [update_dy, update_dx];
                }.bind(this));

            // Inserts SVG into the wTree div with the appropriate dimensions
            this.svgRoot = d3.select(this.getElement().element)
                .append("svg")
                .attr("class","eaDMT-wTree-svg")
                .attr("width", "100%")
                .attr("height", this.size.height + this.margin.top + this.margin.bottom)
                .attr("viewBox", "0, 0, "+ TreeUtils.svgWidth()+", " + this.size.height)
                .on("mousedown.drag", TreeUtils.plot_drag());

            this.layoutRoot = this.svgRoot
                .append("svg:g")
                .attr("class", "eaDMT-wTree-container")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

            // used to draw the plus and minus node buttons
            this.nodeClosed = [{"x":0,"y":-3},{"x":0,"y":3}];
            this.nodeOpen = [{"x":-3,"y":0},{"x":3,"y":0}];

            // draws a either plus or minus in the each node's circle
            this.lineFunction = d3.svg.line()
                .x(function(d) {return d.x;})
                .y(function(d) {return d.y;})
                .interpolate("linear");

            window.onresize = function(){
                this.svgRoot.attr("viewBox", "0, 0, "+ TreeUtils.svgWidth()+", " + this.size.height);
               // this.view.getElement().setStyle("width", TreeUtils.svgWidth());
                this.view.getElement().setModifier("resize");
                setTimeout(function(){
                    this.bufferFunction();
                    this.view.getElement().removeModifier("resize");
                }.bind(this),1000);
            }.bind(this);
        }
    };
 });