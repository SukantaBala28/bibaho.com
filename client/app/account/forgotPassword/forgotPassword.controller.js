'use strict';

class forgotPasswordController {
	constructor(Auth, $state) {
		this.user = {};
		this.errors = {};
		this.submitted = false;

		this.Auth = Auth;
		this.$state = $state;
	}
}

angular.module('hackasolutionApp')
	.controller('forgotPasswordController', forgotPasswordController);
