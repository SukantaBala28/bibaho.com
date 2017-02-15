'use strict';

class userProfileController {

  	constructor(Auth,$http,$scope,$location,$state) {

		this.Auth = Auth;
		this.userInfo = {};
		this.$http = $http;
		this.$state = $state;
		this.$scope = $scope;
		this.$location = $location;
		var query = this.$location.path().split('/');
		this.userId = query[3];
		this.tutors = [];
		this.registeredUsers = [];
		this.user = {};
		this.userProfile = {};
		var _this = this;
		this.fields = [];
		this.reference = [];
		this.reviews = [];
		this.editProfileData = {
			weekDays: []
		};
		this.weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	    this.dayTime = ['Morning', 'Afternoon', 'Evening'];
	    this.scheduleText = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

		this.$http({method: 'GET', url:'/api/users/getUserRole'}).
			then(function(data){
				//console.log(data);
				_this.user = data.data;
		});
		this.$http({method: 'GET', url:'/api/users/getUserProfile/' + _this.userId}).
		then(function(data){

			_this.userProfile = data.data;
			if(_this.userProfile.tutorFlag){

				$http.get('/api/users/getReviews/'+_this.userProfile._id).success(function(data){
					_this.reviews = data.reviews;
				});
			}
		});
  	}

  	acceptRequest(){
  		var _this = this;
        this.$http({method: 'POST', url:'/api/users/acceptRegisteredUser', data: _this.userProfile}).
        then(function(){
        	_this.userProfile.role = 'user';
        	_this.userProfile.accepted = true;
        });
    }

    deleteRequestConfirm(){
  		var _this = this;
        this.$http({method: 'DELETE', url:'/api/users/deleteRegisteredUser/' + _this.userProfile.email}).
        then(function(){
        	_this.$state.go('admin');
        });
    }

    setEditFlag(){
  		//console.log('hi');
		this.editFlag = !this.editFlag;
		//alert('ok');
		//console.log(userType);

		if(this.editFlag === true){

			
			this.editProfileData.weekDays = [];
			for (var i = 0; i < 3; i++) {
	            this.editProfileData.weekDays[i] = new Array(7); 
	        }
		
			
			for(var prop in this.userProfile){
				if(prop==='_id'||prop==='__v'){
					continue;
				}
				if(prop==='weekDays'){

					//console.log(this.userProfile.weekDays);
					if(this.userProfile.weekDays){
						if(this.userProfile.weekDays.length){
							
							angular.copy(this.userProfile.weekDays,this.editProfileData.weekDays);
						}
					}
				}
				else if(prop==='dateOfBirth'){
					this.editProfileData.dateOfBirth = new Date(this.userProfile.dateOfBirth);
				}
				else{
					this.editProfileData[prop] = this.userProfile[prop];
				}

				if(prop === 'hourlyRate'){
					this.editProfileData.hourlyRate = parseInt(this.userProfile.hourlyRate);
				}
			}

		}
		
		// if(userType === 'tutor'){
		// 	this.editProfileData.hourlyRate = Number(this.editProfileData.hourlyRate);
		// }
  	}

  	editProfile(form){
		this.submitted = true;
	    if(form.$valid){
	    	var _this = this;
	    	this.$http({method: 'PUT', url: '/api/users/editProfile/' + this.userProfile._id, data: _this.editProfileData}).
	    	then(function(){
	    		_this.submitted = false;
	    		_this.editFlag = false;
	    		for(var prop in _this.editProfileData){

					if(prop==='_id'||prop==='__v'){
						continue;
					}
					if(prop==='weekDays'){
						angular.copy(_this.editProfileData.weekDays,_this.userProfile.weekDays);
					}
					else if(prop==='dateOfBirth'){
						_this.userProfile.dateOfBirth = new Date(_this.editProfileData.dateOfBirth);
					}
					else{
						_this.userProfile[prop] = _this.editProfileData[prop];
					}
				}
	    	});

	      
	    }
	}

    setvideoUrl(){
    	var url = this.userProfile.videoLink.replace('watch?v=', 'v/');
		$("#videoPreview").attr('src', url);
	}

	stopVideo(){
		$("#videoPreview").attr('src', '');
	}

	triggerFileInput(id){

		// alert('ok');
		_.defer(function(){
			$('#'+id).trigger('click');
		});

	}

	upload(file){
		//alert('ok');
		this.file = file[0];
		//console.log(file);
		//console.log(file);
		var reader = new FileReader();
		reader.readAsDataURL(this.file);
		var _this = this;
		reader.onload = function (e) {

			_this.$scope.$apply(function(){
				_this.uploadingImageSrc = e.target.result;
			});
			//_this.uploadingImageSrc = e.target.result;
			//console.log(this.uploadingImageSrc);
	
		};
	}

	cancelUpload(){
		this.file = '';
		this.uploadingImageSrc = '';
	}

	uploadProfilePicture(){
		this.uploading = true;
		var fd = new FormData();
		var _this = this;
		fd.append('file', this.file, 'file');
		fd.append('userId',this.userProfile._id);
	  	this.$http.post('/api/users/uploadProfilePicture', fd, {
	        transformRequest: angular.identity,
	        headers: {'Content-Type': undefined}
	    }).
	    then(function(data){
	    	//console.log(data);
	    	_this.userProfile.profilePicturePath = data.data.profilePicturePath;
	    	_this.uploading = false;
	    	_this.uploadingImageSrc = '';
	    	_this.file = '';
			
	    });
	}

	referenceCheck(){
		var _this = this;
        this.$http({method: 'PUT', url:'/api/users/referenceCheck/' + _this.userProfile.email}).
        then(function(){
        	_this.userProfile.referenceChecked = true;
        });
	}


}

angular.module('hackasolutionApp')
  .controller('userProfileController', userProfileController);