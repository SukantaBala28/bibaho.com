// 'use strict';

class SidebarController {
  //start-non-standard

  	constructor($scope,Auth,socket, $http,$location,$window,$state) {
		this.isLoggedIn = Auth.isLoggedIn;
		this.socket = socket;
		this.$http = $http;
		this.$location = $location;
		this.Auth = Auth;
		this.user = {};
		this.errors = {};
		this.$state = $state;
		this.$window = $window;
		
  	}

  	closeRightPanel(){
	    var asidePanel = $('.right-menu');
	    if (asidePanel.hasClass('opened')) {
	        asidePanel.toggleClass('opened');
	        $('body').toggleClass('overlay-enable');
	    }
	    return false;
	}

	gotoRegistrationPage(){
		this.closeRightPanel();
		this.$location.path('/registration');
	}

	login(form){
		//alert('ok');
		this.submitted = true;

		console.log(form.$valid);
		if (form.$valid) {
			this.Auth.login({
				email: this.user.email,
				password: this.user.password
			})
			.then((data) => {
				//console.log(this.Auth.getState());
				var state = this.Auth.getState();

				if(state.name){
					this.$state.go(state.name, state.params);
				}
				else{
					if(data.role === 'admin'){
						this.closeRightPanel();
						this.$state.go('admin');
						// this.$window.open('/admin', '_self');
						//this.$location.path('/admin');
					}
					else{
						// if(data.tutorFlag){
						// 	this.$state.go('myProfile');
						// }
						// else{
						// 	this.$state.go('searchHome');
						// }
					}

				}
				//console.log(data);
				// Logged in, redirect to home
				//this.$state.go('main');
			})
			.catch(err => {
				this.errors.other = err.message;
			});
		}
	}
  

  	$onInit() {
  		// this.$http.get('/api/users/getUpdates').then(response => {
	   //    // this.awesomeThings = response.data;
	   //    // this.socket.syncUpdates('thing', this.awesomeThings);
	   //  });
		

  	}

}

angular.module('hackasolutionApp')
  .controller('SidebarController', SidebarController);
