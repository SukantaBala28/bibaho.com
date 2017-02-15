'use strict';

angular.module('hackasolutionApp.auth', [
  'hackasolutionApp.constants',
  'hackasolutionApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
