'use strict';

angular.module('hackasolutionApp')
  .directive('sidebar', () => ({
    templateUrl: 'components/signinBar/signinBar.html',
    restrict: 'E',
    controller: 'SidebarController',
    controllerAs: 'side'
  }));