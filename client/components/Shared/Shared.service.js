'use strict';

(function () {

	function SharedService($location, $http, $cookies, $q, appConfig, Util, UserData) {
		var safeCb = Util.safeCb;
		var bookedTutors = [];
		var bookings = [];

		var Shared = {

			getBookedTutors: function getBookedTutors(callback) {

				if ($cookies.get('token') && $location.path() !== '/logout') {
					bookedTutors = UserData.bookedTutors();
					//console.log(bookedTutors);
				}
				if (arguments.length === 0) {
					return bookedTutors;
				}

				var value = bookedTutors.hasOwnProperty('$promise') ? bookedTutors.$promise : bookedTutors;
				return $q.when(value).then(function (user) {
					console.log(user);
					safeCb(callback)(user);
					return user;
				}, function () {
					safeCb(callback)({});
					return [];
				});
			},
			getBookings: function getBookings(callback) {
				
				if ($cookies.get('token') && $location.path() !== '/logout') {
					bookings = UserData.getBookings();
					//console.log(bookings);
				}
				if (arguments.length === 0) {
					return bookings;
				}

				var value = bookings.hasOwnProperty('$promise') ? bookings.$promise : bookings;
				return $q.when(value).then(function (user) {
					console.log(user);
					safeCb(callback)(user);
					return user;
				}, function () {
					safeCb(callback)({});
					return [];
				});
			},
			getLearnerBookings: function getLearnerBookings(callback) {
				
				if ($cookies.get('token') && $location.path() !== '/logout') {
					bookings = UserData.getLearnerBookings();
					//console.log(bookings);
				}
				if (arguments.length === 0) {
					return bookings;
				}

				var value = bookings.hasOwnProperty('$promise') ? bookings.$promise : bookings;
				return $q.when(value).then(function (user) {
					console.log(user);
					safeCb(callback)(user);
					return user;
				}, function () {
					safeCb(callback)({});
					return [];
				});
			},

		    checkRequested(tutors,tutorId){

		        var find = _.findWhere(tutors,{receiverTutor: tutorId});
		        //console.log(find);
		        if(find){
		            return true;
		        }
		        else{
		            return false;
		        }
		    },

		    editBookings(bookingId, bookingDetails, callback) {
				// console.log(user);
				console.log(bookingDetails);
				return UserData.editBookings({bookingDetails: bookingDetails, bookingId: bookingId},
				function(data) {
					return safeCb(callback)(null, bookingDetails);
				},
				function(err) {
					return safeCb(callback)(err);
				}).$promise;
			
			},
			rejectBookings(bookingId, flag, callback) {
				// console.log(user);
			
				return UserData.rejectBookings({flag: flag, bookingId: bookingId},
				function(data) {
					return safeCb(callback)(null);
				},
				function(err) {
					return safeCb(callback)(err);
				}).$promise;
			
			},
			acceptBookings(bookingId,flag,callback){

				return UserData.acceptBookings({flag: flag, bookingId: bookingId},
				function(data) {
					return safeCb(callback)(null);
				},
				function(err) {
					return safeCb(callback)(err);
				}).$promise;
			}

		};

		return Shared;
	}

	angular.module('hackasolutionApp.Shared').factory('Shared', SharedService);
})();
//# sourceMappingURL=Shared.service.js.map
