'use strict';

angular.module('hackasolutionApp.Shared', [
  'hackasolutionApp.constants',
  'hackasolutionApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
