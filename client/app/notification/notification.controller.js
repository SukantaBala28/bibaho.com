'use strict';
(function() {

class notificationController {
    constructor(User,$http,$location) {
        this.$http = $http;
        this.$location = $location;
        var _this = this;
        $http.get('/api/users/getNotifications').
        then(function(data){

            _this.notifications = data.data.notifications;
            _this.unseenNotifications = data.data.unseenNotifications;
           
        });
    }

    

   

}

angular.module('hackasolution.notification')
  .controller('notificationController', notificationController);

})();
