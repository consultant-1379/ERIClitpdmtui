define([
    "../D3/d3",
    "../Tree/TreeUtils"
],function(d3, TreeUtils){
    var _zoomAmount = 0.05;
    var _zoomSliderAction = function(data) {
        var zoomLevel = data.zoomLevel;
        var offSetYin = data.offSetYin;
        var offSetYout = data.offSetYout;
        var diff = data.diff;

        var y = TreeUtils.getY.call(this);
        var x = TreeUtils.getX(this, this.root);

        if(diff>0){
            this.zoom.scale(zoomLevel);
            this.zoom.translate([x-20, y-offSetYin]);

            this.drawTree.updateTree.call(this, this.root);
        } else {
            this.zoom.scale(zoomLevel);
            this.zoom.translate([x-20, y+offSetYout]);

            this.drawTree.updateTree.call(this, this.root);
        }
    };

    return {
        /**
         * Zoom into the tree
         */
        zoomIn: function (){
            var currentZoomLevel = this.zoom.scale();
            if(currentZoomLevel < this.zoomScale.max-0.01){
                currentZoomLevel = currentZoomLevel + _zoomAmount;
                var y = TreeUtils.getY.call(this);
                var x = TreeUtils.getX(this, this.root);

                this.zoom.scale(currentZoomLevel);
                //NB 310 is a scaling factor
                this.zoom.translate([x-20, y-(_zoomAmount*310)]);

                //Create the ZoomTree Event and Trigger it
                var event = new CustomEvent("zoomTree", {detail:{data:this}});
                this.view.getElement().element.dispatchEvent(event);

                this.drawTree.updateTree.call(this, this.root);  //updates everything after translation of tree
            }
        },

        /**
         * Zoom out of the tree
         */
        zoomOut: function (){
            var currentZoomLevel = this.zoom.scale();
            if(currentZoomLevel >= this.zoomScale.min+0.01){
                currentZoomLevel = currentZoomLevel - _zoomAmount;
                var y = TreeUtils.getY.call(this);
                var x = TreeUtils.getX(this, this.root);

                this.zoom.scale(currentZoomLevel);
                this.zoom.translate([x-20, y+(290 * _zoomAmount)]);

                //Create the ZoomTree Event and Trigger it
                var event = new CustomEvent("zoomTree", {detail:{data:this}});
                this.view.getElement().element.dispatchEvent(event);

                this.drawTree.updateTree.call(this, this.root);  //updates everything after translation of tree
            }
        },

        /**
         * Responsible for calculating zoom range and values to manipulate the tree view
         * @param value
         */
        zoomSlider: function (value){
            var beforeDragValue = this.beforeDragValue;
            if(beforeDragValue === undefined){
                beforeDragValue = 0;
            }
            var dragValue = value;
            var minZoom = this.zoomScale.min;
            var maxZoom = this.zoomScale.max;
            var range = maxZoom - minZoom;

            //diff is used to tell if zooming in or out. Diff is +ve for IN and -ve for OUT
            var diff = dragValue - beforeDragValue;
            var absoluteValueDiff = Math.abs(diff);
            var zoomLevel = (((dragValue/100)*range)+minZoom);
            var zoomAmount = (((absoluteValueDiff/100)*range));

            var offSetYin = (zoomAmount)*310;
            var offSetYout = (zoomAmount)*290;

            var zoomSlide = {
                zoomLevel: zoomLevel,
                offSetYin: offSetYin,
                offSetYout: offSetYout,
                diff: diff
            };

            //Updates the Tree View with the Scale, Translate Factors passed by the ZoomSlide Object
            _zoomSliderAction.call(this, zoomSlide);

            //Set the beforeDragValue to the current slider value
            this.beforeDragValue = value;
        }
    };
});
