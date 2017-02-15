'use strict';

(function() {

function GlobalService($location, $http, $rootScope) {
    

    this.loggedUserDetails={};
    this.onlineTutors={};

    this.saveLoggerUserDetails = function(data){
        this.loggedUserDetails = data;
        $rootScope.$broadcast('loggedUserDetailsUpdated');
    }

    this.updateOnlineTutorList = function(data){
    	this.onlineTutors = data;
    	$rootScope.$broadcast('onlineTutorListUpdated');
    }

    this.updateOnlineTutor = function(data){
    	this.onlineTutors[data.userId] = data;
    	$rootScope.$broadcast('onlineTutorListUpdated');
    }
    this.tutorOffline = function(data){
    	delete this.onlineTutors[data.userId];
    	$rootScope.$broadcast('onlineTutorListUpdated');
    }

    return this;
}

angular.module('hackasolutionApp')
    .factory('Global', GlobalService);

})();
