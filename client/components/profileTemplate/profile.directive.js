'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('hackasolutionApp')
  	.directive('profileTemplate', function() {
	    var profileController = function($scope,Shared,$sce,Global){
	    	$scope.global = Global;
	    	$scope.Shared = Shared;
	    	$scope.$sce = $sce;
	    	$scope.weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	        $scope.dayTime = ['Morning', 'Afternoon', 'Evening'];
	        $scope.fields = [];
	        $scope.privateFields = [];
	        $scope.registrationFields = [];
	        $scope.publicFieldSequence = ['profileHeading','hourlyRate','videoLink','yearsOfExperience','teachingLocation','cancellationNotice'];
			$scope.privateFieldSequence = ['gender','dateOfBirth','hearFrom', 'contactDetails', 'facebookAccount', 'linkedinAccount', 'twitterAccount'];
      		$scope.registrationFieldSequence = ['phoneNumber','postalAddress','cityName','postalCode'];
      		$scope.scheduleText = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

			$scope.myProfile = Global.loggedUserDetails;
			$scope.detailFrame = $scope.$sce.trustAsResourceUrl($scope.profile.videoLink);


			$scope.checkFieldVisibility = function(field){
				if(field instanceof Array){
					if(field.length>0){
						return true;
					}
					else{
						if($scope.myProfile._id !== $scope.profile._id ){
							return false;
						}
						else{
							return true;
						}
					}
				}
				else{
					if(field){
						return true;
					}
					else{
						if($scope.myProfile._id !== $scope.profile._id ){
							return false;
						}
						else{
							return true;
						}

					}
				}

			}
		
				
	        
	    };
	    return{
	        restrict: 'E',
	        scope: {
	            profile: '='
	        },
	        controller: profileController,
	        templateUrl: 'components/profileTemplate/profile.html',
	        link: function(){
	            // alert('ol');
	            // console.log($scope.value);

	        }
	    };
	});