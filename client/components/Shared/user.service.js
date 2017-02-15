'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    bookedTutors: {
      method: 'GET',
      isArray:true,
      params: {
        id: 'getBookedTutors'
      }
    },
    getBookings: {
      method: 'GET',
      isArray:true,
      params: {
        id: 'getBookings'
      }
    },
    getLearnerBookings: {
      method: 'GET',
      isArray:true,
      params: {
        id: 'getLearnerBookings'
      }
    },
    editBookings: {
      method: 'PUT',
      params: {
        id: 'editBookings'
      }
    },
    rejectBookings: {
      method: 'PUT',
      params: {
        id: 'rejectBookings'
      }
    },
    acceptBookings: {
      method: 'PUT',
      params: {
        id: 'acceptBookings'
      }
    }
  });

}

angular.module('hackasolutionApp.Shared')
  .factory('UserData', UserResource);

})();

