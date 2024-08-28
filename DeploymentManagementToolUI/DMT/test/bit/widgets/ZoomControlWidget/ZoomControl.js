define([
    "src/dmt/widgets/ZoomControlWidget/ZoomControl"
], function (ZoomControl) {
    'use strict';

    describe("ZoomControl", function () {

        var zoomControl = {};

        beforeEach(function(){
            zoomControl = new ZoomControl();
        });

        describe('Test the zoom control object plus button', function(){
            it('It should be .eaDMT-wZoomControl-zoomIn-button', function(){
                  expect(zoomControl.view.getPlusBtn().getAttribute('class')).to.equal('eaDMT-wZoomControl-zoomIn-button');
            });

        });

        describe('Test the zoom control object minus button', function(){
            it('It should be .eaDMT-wZoomControl-zoomOut-button', function(){
                expect(zoomControl.view.getMinusBtn().getAttribute('class')).to.equal('eaDMT-wZoomControl-zoomOut-button');
            });
        });


        describe('Test the zoom control object slider', function(){
            it('It should be .eaDMT-wZoomControl-slider', function(){
                expect(zoomControl.view.getZoomSlider().getAttribute('class')).to.equal('eaDMT-wZoomControl-slider');
            });
        });
    });

});
