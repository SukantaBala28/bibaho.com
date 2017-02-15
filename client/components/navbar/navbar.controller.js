// 'use strict';

class NavbarController {
  //start-non-standard
  	menu = [{
		'title': 'Home',
		'state': 'main'
  	}];

  	isCollapsed = true;
  	//end-non-standard

  	constructor($scope,Auth,socket, $http,$location,$timeout,Global) {
		this.isLoggedIn = Auth.isLoggedIn;
		this.socket = socket;
		this.notifications = [];
		this.unseenNotifications = [];
		this.$http = $http;
		this.$timeout = $timeout;
		this.$location = $location;
		this.homeUrl = '/';
		this.currentUser = {};
		this.max = 5;
		var _this = this;
		$scope.$watch('nav.isLoggedIn()', (newValue, oldValue) => {
		    // frontDoor.isOpen has changed
		   if(newValue === true){

		   		Auth.getCurrentUser().$promise.then(function(data){

		   			// console.log(data);
		   			if(data.role==='admin'){
						_this.homeUrl = '/admin';
					}
					else if(data.role==='user'){
						if(data.tutorFlag){

						}
						else{
							_this.homeUrl = '/searchHome';
						}
					}
		   			Global.saveLoggerUserDetails(data);
					_this.currentUser = data;
					//var __this = _this;
					var newUser = {};
					newUser.userId = _this.currentUser._id;
					newUser.firstName = _this.currentUser.firstName;
					newUser.profilePicturePath = _this.currentUser.profilePicturePath;
					newUser.tutorFlag = _this.currentUser.tutorFlag;

					if(newUser.tutorFlag){
						newUser.cityName = _this.currentUser.cityName;
						newUser.teachableLanguage = _this.currentUser.teachableLanguage;
						newUser.relevantExperience = _this.currentUser.relevantExperience;
						newUser.hourlyRate = _this.currentUser.hourlyRate;
						newUser.totalHourCollected = _this.currentUser.totalHourCollected;
						newUser.reviewPoint = _this.currentUser.reviewPoint;
					}
					_this.socket.emitEvent('newUser', newUser);

					// _this.$timeout(function(){
					// 	_this.socket.emitEvent('newUser', {userId: __this.currentUser._id});
					// },9000)
					
					
				});

		   		$http.get('/api/users/getNotifications').
			    then(function(data){

			    	_this.notifications = data.data.notifications;
			    	_this.unseenNotifications = data.data.unseenNotifications;
			    	_this.socket.syncUpdates('notification', _this.notifications);
			    	_this.socket.syncUpdates('notification', _this.unseenNotifications);
			    	// _this.notifications = data;
			    	//console.log(_this.notifications);
			       
			    });
		   }
		});

		
		

  	}

  	clearUnseenNotifications(){
  		var _this = this;
  		if(this.unseenNotifications.length){
  			this.$http.put('/api/users/clearUnseenNotifications').
		    then(function(){

		    	_this.unseenNotifications = [];
		       
		    });
  		}
  		
  	}

  	openRightPanel(){
  		//alert('ok');
  		var asidePanel = $('.right-menu');
  		//console.log(asidePanel);
        if (!asidePanel.hasClass('opened')) {
            if (asidePanel.length) {
                asidePanel.toggleClass('opened');
                $('body').toggleClass('overlay-enable');
            }
        }
        return false;
  	}

  

  	$onInit() {
  		// this.$http.get('/api/users/getUpdates').then(response => {
	   //    // this.awesomeThings = response.data;
	   //    // this.socket.syncUpdates('thing', this.awesomeThings);
	   //  });
		

  	}

}

angular.module('hackasolutionApp')
  .controller('NavbarController', NavbarController);
