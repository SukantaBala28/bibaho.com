'use strict';

angular.module('hackasolutionApp.admin')
  .config(function($stateProvider) {
    $stateProvider
      .state('promoCode', {
        url: '/promoCode',
        templateUrl: 'app/admin/promoCode.html',
        controller: 'PromoCodeController',
        controllerAs: 'admin',
        authenticate: 'admin'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminController',
        controllerAs: 'admin'
      });
  });
