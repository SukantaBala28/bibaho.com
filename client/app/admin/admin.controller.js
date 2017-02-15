'use strict';

(function() {

class AdminController {
	constructor(User,$http) {
		//alert('admin');
		// Use the User $resource to fetch all users
		this.users = User.query();
		this.deleteUser = {};
		this.deleteType;
		// this.users = result.users;
		this.registeredUsers = [];
		this.$http = $http;
		var _this = this;
		$http.get('/api/users/getRegisteredUser').
		then(function(data){
			//console.log(data);
			_this.registeredUsers = data.data;
		});
		// $('body').removeClass('modal-open');
		// $('.modal-backdrop').remove();
	}

	init(){
		this._this = this;
		this.$http.get('/api/users/getRegisteredUser').
		success(function(data){
		  	console.log(data);
		  	this._this.registeredUsers = data;
		  })
	}
	acceptRequest(user){
		this.registeredUsers.splice(this.registeredUsers.indexOf(user), 1);
		this.$http({method: 'POST', url:'/api/users/acceptRegisteredUser', data: user}).
		then(function(){
		});

	}
	deleteRequest(user,flag){
		//user.$remove();
		// alert('ok');
		// console.log(user);
		this.deleteType = 'application';
		this.modalBody = "Are you sure you want to delete the request?";
		this.modalHeader= "Delete Request";
		this.deleteUser = user;
			if(flag === 'noEmail'){
			this.noEmail = true;
		}
		$('#deletUser').modal('show');

		// this.registeredUsers.splice(this.registeredUsers.indexOf(user), 1);
		// this.$http({ method: 'DELETE', url: '/api/users/deleteRegisteredUser/'+user.email}).then(function () {});

	}

	deleteRequestConfirm(){
	 
		var user = this.deleteUser;
		var _this = this;
		this.registeredUsers.splice(this.registeredUsers.indexOf(user), 1);
		this.$http({ method: 'POST', url: '/api/users/deleteRegisteredUser/'+user.email, data:{noEmail: this.noEmail}}).then(function () {
			_this.deleteUser = {};
			_this.deleteType = '';
		});
	}

	delete(user) {
		//user.$remove();
		this.deleteType = 'user';
		this.modalBody = "Are you sure you want to delete the user?";
		this.modalHeader= "Delete User";
		this.deleteUser = user;
		$('#deletUser').modal('show');

	}

	deleteUserConfirm(){
		var user = this.deleteUser;
		var _this = this;
		this.users.splice(this.users.indexOf(user), 1);
		this.$http({ method: 'Delete', url: '/api/users/deleteUser/'+user._id}).then(function () {
			_this.deleteUser = {};
			_this.deleteType = '';
		});

	}

	saveForLaterRequest(user){

		var _this = this;
		this.$http({method: 'PUT', url: '/api/users/saveForLaterRequest/'+user._id}).then(function(){
			_this.registeredUsers.splice(_this.registeredUsers.indexOf(user), 1);
		})

	}

	disableSearch(user){
		user.searchDisabled = !user.searchDisabled;
		var _this = this;
		this.$http({ method: 'PUT', url: '/api/users/disableSearch/'+user._id, data: {searchDisabled: user.searchDisabled} }).then(function () {

		});
	}
}

angular.module('hackasolutionApp.admin')
	.controller('AdminController', AdminController);

})();
