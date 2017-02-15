'use strict';

angular.module('hackasolutionApp')
.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
      
        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 200) {
                $("#site-header").removeClass( "show" ).addClass( "hide" );
            } else {
                $("#site-header").removeClass( "hide" ).addClass( "show" );
                 //console.log('Header is in view.');
            }
            scope.$apply();
        });

        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 250) {
                $("#scrollContent").removeClass( "marginLow" ).addClass( "marginHigh" );
            } else {
                $("#scrollContent").removeClass( "marginHigh" ).addClass( "marginLow" );
                 //console.log('Header is in view.');
            }
            scope.$apply();
        });
    };
});
