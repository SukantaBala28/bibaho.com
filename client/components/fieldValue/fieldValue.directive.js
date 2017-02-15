'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('hackasolutionApp')
  	.directive('fieldValueTemplate', function() {
	    var valueController = function($scope){
	        $scope.isArray = function(){

	            if($scope.values instanceof Array){
	                return true;
	            }
	            else{
	                return false;
	            }
	        };
	        $scope.isDate = function(){
	        	if(new Date($scope.values) instanceof Date){
	        		return true;
	        	}
	        	else{
	        		return false;
	        	}
	        }
	    };
	    return{
	        restrict: 'E',
	        scope: {
	            values: '='
	        },
	        controller: valueController,
	        templateUrl: 'components/fieldValue/fieldValue.html',
	        link: function(){
	            // alert('ol');
	            // console.log($scope.value);

	        }
	    };
	});
