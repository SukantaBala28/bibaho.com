'use strict';

class recoverPasswordController {
  constructor(Auth,$http,$stateParams) {
    this.errors = {};
    this.submitted = false;
    this.$http = $http;
    this.Auth = Auth;
    this.userId = $stateParams.userId;
  }

  recoverPassword(form) {
    this.submitted = true;

    if (form.$valid) {
      
      this.$http({method: 'PUT', url: '/api/users/recoverPassword/' + this.userId , data: {newPass: this.user.newPassword} })
        .then(() => {
          this.message = 'Password successfully changed.';
        });
       
    }
  }
}

angular.module('hackasolutionApp')
  .controller('recoverPasswordController', recoverPasswordController);
