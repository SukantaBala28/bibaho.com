'use strict';

angular.module('hackasolutionApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>',
        controller: function($state, Auth, Global, $scope) {

			$scope.$on('loggedUserDetailsUpdated', function() {

				if(!Global.loggedUserDetails.role){
					//$state.go('login');
				}
				else{

					if(Global.loggedUserDetails.role==='admin'){
						$state.go('admin');
					}
					else if(Global.loggedUserDetails.role==='user'){
						if(Global.loggedUserDetails.tutorFlag){

							$state.go('myProfile');
						}
						else{
							$state.go('searchHome');
						}
					}
				}
				
			});
		}

      });
  });