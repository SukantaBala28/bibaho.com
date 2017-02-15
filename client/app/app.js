'use strict';

angular.module('hackasolutionApp', [
	  'hackasolutionApp.auth',
    'hackasolutionApp.Shared',
    //'hackasolutionApp.notification',
    'hackasolutionApp.admin',
  	'hackasolutionApp.constants',
  	'ngCookies',
  	'ngResource',
  	'ngSanitize',
  	'btford.socket-io',
  	'ui.router',
  	'ui.bootstrap',
  	'validation.match',
  	'ngFileUpload',
    'angular-matchheight'
	
])
.run(function($rootScope) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      var asidePanel = $('.right-menu');
      if (asidePanel.hasClass('opened')) {
          asidePanel.toggleClass('opened');
          $('body').toggleClass('overlay-enable');
      }
  });
})
.config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });

