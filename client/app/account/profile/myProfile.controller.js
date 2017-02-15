'use strict';

class myProfileController {

  	constructor(Auth,$http,$location,$state,$sce,Global,SharedData,$scope) {

		this.Auth = Auth;
		this.myProfile = {};
		this.$http = $http;
		this.$state = $state;
		this.$scope = $scope;
		this.$location = $location;
		this.fields = [];
		this.privateFields = [];
		this.editFlag = false;
		this.submitted = false;
		this.editStep = 0;
		this.detailFrame = '';
		this.$sce = $sce;
		this.editProfileData = {
			weekDays: []
		};
		this.yearExperienceOptions = ['None', '1 year', '2 years', '3 years', 'more than 3 years'];
		this.languageList = SharedData.languageList;
		this.cityList = SharedData.cityList;
		this.hobbyList = SharedData.hobbyList;
		this.cancellationNotice = ['8 hours','24 hours','2 days','1 week'];
		this.preferredLocations = ["Student's location", 'Coffee Shop', 'Library', 'My Location', 'Online'];
		this.gender = ['Male','Female','Prefer not to say'];
		this.weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	    this.dayTime = ['Morning', 'Afternoon', 'Evening'];
	    this.scheduleText = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	    this.reviews = [];

		var _this = this;
		$http.get('/api/users/me').
		then(function(data){
			//console.log(data);
			_this.myProfile = data.data;

			if(_this.myProfile.tutorFlag){

				$http.get('/api/users/getReviews/'+_this.myProfile._id).success(function(data){
					_this.reviews = data.reviews;
					//console.log(_this.reviews);
				});
			}
		
		});

		// 	for(var i=0;i<_this.privateFieldSequence.length;i++){
		// 		var prop = _this.privateFieldSequence[i];
		// 		var fieldName = _this.fieldMapping[prop];
		// 		_this.privateFields.push({fieldName: fieldName, fieldValue: _this.myProfile[prop]});
				
		// 	}
			
		// });
  	}

  	setSchedule(timeIndex,weekIndex){
        //alert('ok');
        //console.log(this.editProfileData.weekDays);
        this.editProfileData.weekDays[timeIndex][weekIndex] = !this.editProfileData.weekDays[timeIndex][weekIndex];
    }

  	setEditFlag(userType){
  		//console.log('hi');
		this.editFlag = !this.editFlag;
		//alert('ok');
		//console.log(userType);

		if(this.editFlag === true){

			if(userType === 'tutor'){
				this.editProfileData.weekDays = [];
				for (var i = 0; i < 3; i++) {
		            this.editProfileData.weekDays[i] = new Array(7); 
		        }
			}
			
			for(var prop in this.myProfile){
				if(prop==='_id'||prop==='__v'){
					continue;
				}
				if(prop==='weekDays'){

					//console.log(this.myProfile.weekDays);
					if(this.myProfile.weekDays){
						if(this.myProfile.weekDays.length){
							
							angular.copy(this.myProfile.weekDays,this.editProfileData.weekDays);
						}
					}
				}
				else if(prop==='dateOfBirth'){
					this.editProfileData.dateOfBirth = new Date(this.myProfile.dateOfBirth);
				}
				else{
					this.editProfileData[prop] = this.myProfile[prop]
				}

				if(prop === 'hourlyRate'){
					this.editProfileData.hourlyRate = parseInt(this.myProfile.hourlyRate);
				}
			}

		}
		
		// if(userType === 'tutor'){
		// 	this.editProfileData.hourlyRate = Number(this.editProfileData.hourlyRate);
		// }
  	}

  	submitEditStep1(form){

	    this.submitted = true;

	    if(form.$valid){
	    	var _this = this;
	    	this.$http({method: 'PUT', url: '/api/users/editProfile', data: _this.myProfile}).
	    	then(function(){
	    		_this.submitted = false;
	    		_this.editFlag = false;
	    		_this.detailFrame = _this.$sce.trustAsResourceUrl(_this.myProfile.videoLink);
	    	});

	      
	    }
  	}

  	getNumber(num) {
		return new Array(num);   
	}

	editProfile(form){

		this.submitted = true;
	    if(form.$valid){
	    	var _this = this;
	    	this.$http({method: 'PUT', url: '/api/users/editProfile', data: _this.editProfileData}).
	    	then(function(){
	    		_this.submitted = false;
	    		_this.editFlag = false;
	    		for(var prop in _this.editProfileData){

					if(prop==='_id'||prop==='__v'){
						continue;
					}
					if(prop==='weekDays'){
						angular.copy(_this.editProfileData.weekDays,_this.myProfile.weekDays);
					}
					else if(prop==='dateOfBirth'){
						_this.myProfile.dateOfBirth = new Date(_this.editProfileData.dateOfBirth);
					}
					else{
						_this.myProfile[prop] = _this.editProfileData[prop];
					}
				}
	    	});

	      
	    }
	}

	trustSrc(src) {
	    return this.$sce.trustAsResourceUrl(src);
	}

	setvideoUrl(){
		var url = this.myProfile.videoLink.replace('watch?v=', 'v/');
		$('#videoPreview').attr('src', url);
	}

	stopVideo(){
		$('#videoPreview').attr('src', '');
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
		fd.append('userId',this.myProfile._id);
	  	this.$http.post('/api/users/uploadProfilePicture', fd, {
	        transformRequest: angular.identity,
	        headers: {'Content-Type': undefined}
	    }).
	    then(function(data){
	    	//console.log(data);
	    	_this.myProfile.profilePicturePath = data.data.profilePicturePath;
	    	_this.uploading = false;
	    	_this.uploadingImageSrc = '';
	    	_this.file = '';
			
	    });
	}



}

angular.module('hackasolutionApp')
  .controller('myProfileController', myProfileController);