define([
    'jscore/core',
    "./NavigationBarView",
    "../../ext/Navigation/NavigationBarUtils",
    "../../widgets/NavigationResult/NavigationBarResult"

], function (core, View, UTILS, List) {

    var _root = {};

    return core.Widget.extend({

        View: View,

        onViewReady: function (){
            var input = this.view.getNavBarInput(),
                button = this.view.getNavBarButton(),
                buttonIcon = this.view.getNavBarButtonIcon(),
                cancelButton = this.view.getCancelButton(),
                resultList = List,
                parent = this.getElement();

            //Setup Navigation Bar object
            this.navBar = {
                wc: this.options.wc,
                view: parent.element,
                parentView: parent,
                path: input,
                list: resultList,
                enterButton: button,
                enterButtonIcon: buttonIcon,
                cancelButton: cancelButton,
                lastPath: "",
                result: {
                    path:"",
                    children:[],
                    finalPath: "/",
                    pathChildren:[]
                }
            };

            this.view.disableNavBar();
        },

        /**
         * Event Bus for Keyboard and Mouse, called when Tree has loaded
         * @param root
         */
        navBarEvents: function(root){
            var navBar = this.navBar;
            _root = root;

            this.view.enableNavBar();

            this.view.addKeydownEventHandler(function(e){
                UTILS.keyBoardEvents(e, navBar, _root);
            });

            this.view.addInputEventHandler(function() {
                UTILS.fetchList(navBar, _root);
            });

            this.view.addFocusEventHandler(function() {
                UTILS.fetchList(navBar, _root);
            });

            this.view.addBlurEventHandler(function() {
                UTILS.destroyList();
            });

            this.view.addClickHandler(function() {
                UTILS.openTree.call(navBar, _root);
            });

            this.view.addCancelClickHandler(function() {
                UTILS.clearSearch(navBar);
            });
        },

        setNavBarPath: function(options){
            this.view.setNavBarInput(options.path);
        }
    });

});