'use strict';

(function() {

class MainController {

  constructor($http, $scope, $location, socket) {
    this.$http = $http;
    this.socket = socket;
  
  }

  // gotoRegistrationPage(){
  //   alert('ok');
  //   $location.path('/registration');

  // }


  $onInit() {
    
  }

}

angular.module('hackasolutionApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();