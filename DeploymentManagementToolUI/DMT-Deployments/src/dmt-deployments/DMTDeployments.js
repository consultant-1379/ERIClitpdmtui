define([
    'jscore/core',
    './DMTDeploymentsView',
    "./regions/Table/Table",
    'widgets/Breadcrumb',
    "./ext/CRUD/CRUD"
], function (core, View, TableRegion, Breadcrumb, CRUD) {

    var _setURIS = function(response){
        this.BASE_URI = response.links.self;
        this.WC_URI = response.links.working_copies;
        if(this.WC_URI){
            this.getWcURI();
        }
    };

    var _startTable = function(response){
        var tableRegion = new TableRegion({context: this.getContext(), wc: response.working_copies});
        tableRegion.start(this.getElement());
    };

    return core.App.extend({

        View: View,

        init: function(){
            this.DMT_REST_URI = "/dmt/rest";
            this.BASE_URI = "/";

            //Initial GET Request
            this.getBaseURI = function(){
                CRUD.get(this.DMT_REST_URI, _setURIS.bind(this), null);
            }.bind(this);

            this.getWcURI = function(){
                CRUD.get(this.WC_URI, _startTable.bind(this), _startTable.bind(this));
            }.bind(this);
        },

        onStart: function (parent) {

            var breadcrumb = new Breadcrumb({data: this.options.breadcrumb});
            breadcrumb.attachTo(this.view.getBreadcrumb());

            //Get Base URI
            this.getBaseURI();
        }
    });

});
