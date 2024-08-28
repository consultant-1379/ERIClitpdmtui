define([
    'jscore/core',
    "./ZoomControlView",
	"./../../ext/D3/d3"
], function (core, View, d3) {

    /**
     * Method updates the slider with the new value to be displayed.
     *
     * @param val  the new value that is be displayed
     * @param view   the view that contains the slider
     * @private
     */
    var _updateSlider = function (val, view) {
        var zoomSlider = view.getZoomSlider();
        zoomSlider.element.value = val;
    };

    /**
     * Draw SVG Slider
     * @param view
     * @private
     */
    var _drawSVGSlider = function(view) {
        //nb height of the zoom Axis
        this.zoomIndicatorHeight = {height:135};
        this.zoomContainer = {width:30, height:this.zoomIndicatorHeight.height + 5};

        this.zoomIndicatorContainer = d3.select(view.getZoomSliderSVG().element)
            .append("svg")
            .attr("class", "zoomContainer")
            .attr("width", this.zoomContainer.width)
            .attr("height", this.zoomContainer.height);
        this.zoomIndicatorContainer.append("line")
            .attr("class", "zoomIndicatorAxis")
            .attr("x1", 15)
            .attr("y1", this.zoomIndicatorHeight.height)
            .attr("x2", 15)
            .attr("y2", this.zoomIndicatorHeight.height)
            .attr("stroke-width", 4)
            .attr("stroke", "red");
        this.zoomIndicatorContainer.append("line")
            .attr("class", "zoomLine")
            .attr("x1", 15)
            .attr("y1", 0)
            .attr("x2", 15)
            .attr("y2", this.zoomIndicatorHeight.height)
            .attr("stroke-width", 4)
            .attr("stroke", "#CCC")
            .attr("opacity", 1.0);
        this.zoomIndicatorContainer.append("rect")
            .attr("class", "zoomIndicatorBottom")
            .attr("x", 7.5)
            .attr("y", this.zoomIndicatorHeight.height)
            .attr("width", this.zoomContainer.width/2)
            .attr("height", 4.5)
            .attr("fill", "red");
        this.zoomIndicatorContainer.append("rect")
            .attr("class", "zoomIndicatorTop")
            .attr("x", 7.5)
            .attr("y", 0)
            .attr("width", this.zoomContainer.width/2)
            .attr("height", 4.5)
            .attr("fill", "red");
    } ;


    return core.Widget.extend({

        View: View,
        onViewReady: function (options) {
            this.rangeSupport = options.rangeSupport;
            if(this.rangeSupport){
                this.view.getZoomSliderSVG().setModifier("hidden");
            }
            else{
                this.view.getZoomSlider().setModifier("hidden");
                _drawSVGSlider.call(this, this.view);
            }
        },
        zoomLevelIndicator: function (TREE) {
            var zoomLevel = TREE.zoom.scale();
            var minZoom = TREE.zoomScale.min;
            var maxZoom = TREE.zoomScale.max;
            var range = maxZoom - minZoom;
            var percentage = (((zoomLevel-minZoom)/range) * 100);

            //Check if range-slider is supported, else update SVGSlider
            if(this.rangeSupport){
                _updateSlider(percentage, this.view);
            }
            else{
                var currentLineHeight = (percentage/100)*this.zoomIndicatorHeight.height;
                this.zoomIndicatorContainer.select("line.zoomIndicatorAxis").transition().attr("y2",this.zoomIndicatorHeight.height-(currentLineHeight));
                this.zoomIndicatorContainer.select("line.zoomLine").transition().attr("y2",this.zoomIndicatorHeight.height-(currentLineHeight));
            }

            TREE.beforeDragValue = percentage;

        }

    });
});