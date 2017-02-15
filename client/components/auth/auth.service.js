'use strict';

(function() {

function AuthService($location, $http, $cookies, $q, $state, appConfig, Util, User) {
	var safeCb = Util.safeCb;
	var currentUser = {};
	var userRoles = appConfig.userRoles || [];

	if ($cookies.get('token') && $location.path() !== '/logout') {
		currentUser = User.get();
	}

	var Auth = {

		/**
		 * Authenticate user and save token
		 *
		 * @param  {Object}   user     - login info
		 * @param  {Function} callback - optional, function(error, user)
		 * @return {Promise}
		 */

		login({email, password}, callback) {
			return $http.post('/auth/local', {
				email: email,
				password: password
			})
			.then(res => {
				$cookies.put('token', res.data.token);
				currentUser = User.get();
				return currentUser.$promise;
			})
			.then(user => {
				//console.log(user.role);
				safeCb(callback)(null, user);
				return user;
			})
			.catch(err => {
				Auth.logout();
				safeCb(callback)(err.data);
				return $q.reject(err.data);
			});
		},

		/**
		 * Delete access token and user info
		 */
		logout() {
			$cookies.remove('token');
			currentUser = {};
		},

		/**
		 * Create a new user
		 *
		 * @param  {Object}   user     - user info
		 * @param  {Function} callback - optional, function(error, user)
		 * @return {Promise}
		 */
		createUser(user, callback) {
			// console.log(user);
			if(user.type==='registration'){
				return User.save(user,
				function(data) {
					Auth.logout();
					return safeCb(callback)(null,{});
				},
				function(err) {
					Auth.logout();
					return safeCb(callback)(err);
				}).$promise;

			}
			else{
				return User.save(user,
				function(data) {
					Auth.logout();
					return safeCb(callback)(null,{});
					// $cookies.put('token', data.token);
					// currentUser = User.get();
					// return safeCb(callback)(null, user);
				},
				function(err) {
					Auth.logout();
					return safeCb(callback)(err);
				}).$promise;
			}
			
		},

		/**
		 * register new user
		 *
		 * @param  {Object}   user     - user info
		 * @param  {Function} callback - optional, function(error, user)
		 * @return {Promise}
		 */
		// registerTutor(user, callback) {
		//   alert('ok');
		//   console.log(user);
		//   // return User.save(user,
		//   //   function(data) {
		//   //     $cookies.put('token', data.token);
		//   //     currentUser = User.get();
		//   //     return safeCb(callback)(null, user);
		//   //   },
		//   //   function(err) {
		//   //     Auth.logout();
		//   //     return safeCb(callback)(err);
		//   //   }).$promise;
		// },


		/**
		 * Change password
		 *
		 * @param  {String}   oldPassword
		 * @param  {String}   newPassword
		 * @param  {Function} callback    - optional, function(error, user)
		 * @return {Promise}
		 */
		changePassword(oldPassword, newPassword, callback) {
			return User.changePassword({ id: currentUser._id }, {
				oldPassword: oldPassword,
				newPassword: newPassword
			}, function() {
				return safeCb(callback)(null);
			}, function(err) {
				return safeCb(callback)(err);
			}).$promise;
		},

		/**
		 * Gets all available info on a user
		 *   (synchronous|asynchronous)
		 *
		 * @param  {Function|*} callback - optional, funciton(user)
		 * @return {Object|Promise}
		 */
		getCurrentUser(callback) {
			if (arguments.length === 0) {
				return currentUser;
			}

			var value = (currentUser.hasOwnProperty('$promise')) ?
				currentUser.$promise : currentUser;
			return $q.when(value)
				.then(user => {
					safeCb(callback)(user);
					return user;
				}, () => {
					safeCb(callback)({});
					return {};
				});
		},

		/**
		 * Check if a user is logged in
		 *   (synchronous|asynchronous)
		 *
		 * @param  {Function|*} callback - optional, function(is)
		 * @return {Bool|Promise}
		 */
		isLoggedIn(callback) {
			if (arguments.length === 0) {
				return currentUser.hasOwnProperty('role');
			}

			return Auth.getCurrentUser(null)
				.then(user => {
					var is = user.hasOwnProperty('role');
					safeCb(callback)(is);
					return is;
				});

			// return Auth.getCurrentUser(null)
			// 	.then(user => {
			// 		var is = (user.hasOwnProperty('role')) ?
			// 			isValidated(user.role,user.tutorFlag,user.learnerEmailValidated) : false;
			// 		safeCb(callback)(is);
			// 		return is;
			// 	});
		},
		isValidLoggedIn(callback) {
			// var isValidated = function(role,tutorFlag,learnerEmailValidated){
			// 	if(role==='user' && !tutorFlag){
			// 		if(learnerEmailValidated){
			// 			return true;
			// 		}
			// 		else{
			// 			return false;
			// 		}
			// 	}
			// 	else{
			// 		return false;
			// 	}

			// }

			if (arguments.length === 0) {
				return currentUser.hasOwnProperty('role');
			}
				
			return Auth.getCurrentUser(null)
				.then(user => {
					var is = (user.hasOwnProperty('role')) ;
					safeCb(callback)(is);
					return {is:is,role:user.role,tutorFlag:user.tutorFlag,learnerEmailValidated:user.learnerEmailValidated};
				});
		},


		 /**
			* Check if a user has a specified role or higher
			*   (synchronous|asynchronous)
			*
			* @param  {String}     role     - the role to check against
			* @param  {Function|*} callback - optional, function(has)
			* @return {Bool|Promise}
			*/
		hasValidRole(role, callback) {
			//console.log(role);
			// console.log($location.$$path);
			var path = $location.path();
			var state = {};

			if(path.indexOf('/bookTutor')!==-1){
				state.name = 'bookTutor';
				var splitString = path.split('/');
				var tutorId = splitString[2];
				state.params = {tutorId: tutorId};

				$cookies.put('state',JSON.stringify(state));
			}
			if(path.indexOf('/payment')!==-1){
				state.name = 'payment';
				$cookies.put('state',JSON.stringify(state));
			}

			if(role==='learner'){

				var isLearner = function(role,tutorFlag){
					if(role==='user' && !tutorFlag){
						return true;
					}
					else{
						return false;
					}

				}
				return Auth.getCurrentUser(null)
					.then(user => {
						var has = (user.hasOwnProperty('role')) ?
							isLearner(user.role,user.tutorFlag) : false;
						safeCb(callback)(has);
						return {has:has,role:user.role,tutorFlag:user.tutorFlag,learnerEmailValidated:user.learnerEmailValidated};
					});

			}
			else if(role==='tutor'){
				var isTutor = function(role,tutorFlag){
					if(role==='user' && tutorFlag){
						return true;
					}
					else{
						return false;
					}

				}
				return Auth.getCurrentUser(null)
					.then(user => {
						var has = (user.hasOwnProperty('role')) ?
							isTutor(user.role,user.tutorFlag) : false;
						safeCb(callback)(has);
						return {has:has,role:user.role,tutorFlag:user.tutorFlag,learnerEmailValidated:user.learnerEmailValidated};
					});

			}
			else{
				var hasRole = function(r, h) {
					return r === h;
				};

				if (arguments.length < 2) {
					return hasRole(currentUser.role, role);
				}

				return Auth.getCurrentUser(null)
					.then(user => {
						// console.log(user);
						var has = (user.hasOwnProperty('role')) ?
							hasRole(user.role, role) : false;
						safeCb(callback)(has);
						return {has:has,role:user.role,tutorFlag:user.tutorFlag,learnerEmailValidated:user.learnerEmailValidated};
					});

			}

		},
		hasRole(role, callback) {
			//console.log(role);
			
			var hasRole = function(r, h) {
				return r === h;
			};

			if (arguments.length < 2) {
				return hasRole(currentUser.role, role);
			}

			return Auth.getCurrentUser(null)
				.then(user => {
					// console.log(user);
					var has = (user.hasOwnProperty('role')) ?
						hasRole(user.role, role) : false;
					safeCb(callback)(has);
					return has;
				});

			

		},

		 /**
			* Check if a user is an admin
			*   (synchronous|asynchronous)
			*
			* @param  {Function|*} callback - optional, function(is)
			* @return {Bool|Promise}
			*/
		isAdmin() {
			return Auth.hasRole
				.apply(Auth, [].concat.apply(['admin'], arguments));
		},

		/**
		 * Get auth token
		 *
		 * @return {String} - a token string used for authenticating
		 */

		setBookingDeatils(bookingDetails){
			$cookies.put('bookingDetails',JSON.stringify(bookingDetails));
			
		},
		clearBookingDetails(){
			$cookies.remove('bookingDetails');
		},
		getBookingDetails(){
			if($cookies.get('bookingDetails')){
				var bookingData = JSON.parse($cookies.get('bookingDetails'));
				
				return bookingData;
			}
			else{
				return {};
			}
	
		},
		getToken() {
			return $cookies.get('token');
		},

		getState(){

			if($cookies.get('state')){
				var stateData = JSON.parse($cookies.get('state'));
				$cookies.remove('state');
				return stateData;
			}
			else{
				return {};
			}
			
		}
	};

	return Auth;
}

angular.module('hackasolutionApp.auth')
	.factory('Auth', AuthService);

})();
