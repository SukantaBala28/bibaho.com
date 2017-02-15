'use strict';

angular.module('hackasolution.notification')
	.config(function($stateProvider) {
		$stateProvider
			.state('notification', {
				url: '/notification',
				templateUrl: 'app/notification/notification.html',
				controller: 'notificationController',
				controllerAs: 'notification',
				authenticate: true
			});
	});