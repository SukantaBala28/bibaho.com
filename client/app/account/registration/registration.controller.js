'use strict';

class RegistrationController {

	constructor(Auth,$http,$state,Upload,$location,SharedData,$window) {
		this.errors = {};
		//this.requestSuccessMessage=false;
		this.submitted = false;
		this.SharedData = SharedData;
		this.$location = $location;
		this.$window = $window;
		this.stepNo = 0;
		this.stepCompleted = 0;
		this.Auth = Auth;
		this.file = {};
		this.resume = {};
		this.Upload = Upload;
		this.uploadingFile = {};
		//this.uploadingFile = uploadingFile;
		this.userInfo = {
		};
		this.$http = $http;
		this.$state = $state;
		this.current_fs;
		this.next_fs;
		this.textSuccessMessage = false;
		this.previous_fs; //fieldsets
		this.left;
		this.opacity;
		this.scale; //fieldset properties which we will animate
		this.animating; //flag to prevent quick multi-click glitches
		this.weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	    this.dayTime = ['Morning', 'Afternoon', 'Evening'];
	    this.scheduleText = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	    this.availableMatrix = [];
	    this.submitted = false;
		for (var i = 0; i < 3; i++) {
            this.availableMatrix[i] = new Array(7); 
        }
	}

	uploadResume(file){
		//var reader = new FileReader();
		//var file = files[0];
		this.resume = file;
		console.log(this.resume);
		//alert(this.resume.name);
		//alert("File size is ok");	
	}
	submitSolutionForm(form){
		//alert("NO");
		this.submitted=true;
		var _this = this;
		if(form.$valid){
			this.$http({method: 'POST', url: '/api/users/sendGetASolutionEmail', data:{name:_this.userInfo.name,email:_this.userInfo.email,phone:_this.userInfo.phone}}).
			then(function(data){
				//alert("mu name is");
				console.log(data);
				if(data.data.error){
					alert("Your Email Does not Exist");
				} 
				else{	
					_this.textSuccessMessage = true;
					_this.userInfo.name = "";
					_this.userInfo.email = "";
					_this.userInfo.phone = "";
					//alert("Your Request Sent Successfully.");
				}
			})
			// alert(name);
		}
	}

	submitJoinForm(form){
		//alert("NO");
		this.submitted=true;
		var _this = this;
		if(form.$valid){
			var fd = new FormData();
			// console.log(this.userInfo);

			if(this.resume){
				fd.append('file', this.resume[0], 'file');
			}
			fd.append('email',_this.userInfo.email);
			console.log(fd);
			console.log(_this.userInfo.email);
			var _this = this;
		    _this.$http.post('/api/users/sendJoinFormEmail', fd, {
		        transformRequest: angular.identity,
		        headers: {'Content-Type': undefined}
		    }).
		   	then(function(data){
		   		if(data.data.error){
					alert("Your Email Does not Exist");
				} 
				else{
					_this.userInfo.email = "";
					_this.userInfo.Resume = "";
					_this.textSuccessMessage = true;
					//alert("Your Join Request Sent Successfully.");
				}
		   	})
		}
	}

	uploadResumeForm(files){
		var _this = this;
		var reader = new FileReader();
		var file = files[0];
		if(file.size<4000000){
			alert("File Size is ok.");
			this.uploadingFile = files;
			console.log(this.uploadingFile);

		} else{
			alert("File Size is not ok.");
			this.uploadingFile = '';
		}
	}

	submitForm(form){
		//alert('ok');
		console.log(form);
		this.submitted = true;
		if(form.$valid){
			if(this.stepNo===0){
				//alert('ok');
				var _this = this;
				this.$http({method: 'POST', url:'/api/users/checkEmail', data: {email: _this.userInfo.email}}).
				then(function(data){
					console.log(data);
					if(data.data.error){
						// _this.errors = {};
						// form.email.$setValidity('mongoose', false);
						// _this.errors.email = 'The specified email address is already in use.';
						alert('email exist');
					}
					else{
						_this.gotoNextStep();
					}
					
				})
			 	.catch(err => {
					err = err.data;

				});
			}
			else{
				this.gotoNextStep();
			}
			
			//alert(this.stepNo);
		
		}

	}

	
	// gotoNextStep(){

	// 	//alert(this.stepNo);
	// 	this.submitted = false;
	// 	this.stepNo++;

	// 	if(this.stepNo==5){

	// 		var fd = new FormData();
	// 		// console.log(this.userInfo);

	// 		if(this.resume){
	// 			fd.append('file', this.resume[0], 'file');
	// 		}
			
	// 		// fd.append('email', 'seema_csedu33@yahoo.com');
	// 		for(var prop in this.userInfo){
				
	// 			if(this.userInfo[prop] instanceof Array){
					
	// 				for(i=0;i<this.userInfo[prop].length;i++){
	// 					fd.append(prop,JSON.stringify(this.userInfo[prop][i]));
	// 				}
					
	// 			}
	// 			else{
	// 				fd.append(prop,this.userInfo[prop]);
	// 			}
	// 		}
	// 		var _this = this;
	// 	    this.$http.post('/api/users/registration', fd, {
	// 	        transformRequest: angular.identity,
	// 	        headers: {'Content-Type': undefined}
	// 	    }).
	// 	   	then(function(data){
	// 	   		_this.animateToNextStep();
	// 	   	})

	// 	}
	// 	else{
	// 		this.animateToNextStep();

	// 	}
		
	// }

	animateToNextStep(){
		// alert('ok');
		//alert(this.stepNo);
		if(this.animating) return false;
		this.animating = false;
		
		// console.log($('.next'+this.stepNo));
		this.current_fs = $($('.next'+this.stepNo)[0]).parent();
		this.next_fs = $($('.next'+this.stepNo)[0]).parent().next();
		console.log(this.current_fs);
		console.log(this.next_fs);
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(this.next_fs)).addClass("active");
		
		//show the next fieldset
		this.next_fs.show(); 
		//hide the current fieldset with style
		var _this = this;
		this.current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				_this.scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				_this.left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				_this.opacity = 1 - now;
				_this.current_fs.css({'transform': 'scale('+_this.scale+')','position': 'absolute'});
				_this.next_fs.css({'left': _this.left, 'opacity': _this.opacity});
			}, 
			duration: 800, 
			complete: function(){
				_this.current_fs.hide();
				_this.animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});

	}

	gotoPreviousStep(){

		if(this.animating) return false;
		this.animating = true;
		
		this.current_fs = $($('.previous'+this.stepNo)[0]).parent();
		this.previous_fs = $($('.previous'+this.stepNo)[0]).parent().prev();
		
		
		//de-activate this.current step on progressbar
		$("#progressbar li").eq($("fieldset").index(this.current_fs)).removeClass("active");
		
		//show the previous fieldset
		this.previous_fs.show(); 
		//hide the this.current fieldset with style
		var _this = this;
		this.current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of this.current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				_this.scale = 0.8 + (1 - now) * 0.2;
				//2. take _this.current_fs to the right(50%) - from 0%
				_this.left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				_this.opacity = 1 - now;
				_this.current_fs.css({'left': left});
				_this.previous_fs.css({'transform': 'scale('+_this.scale+')', 'position': 'relative', 'opacity': _this.opacity});
			}, 
			duration: 800, 
			complete: function(){
				_this.current_fs.hide();
				_this.animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
		this.stepNo--;
	}
	setSchedule(timeIndex,weekIndex){
        //alert('ok');
        //console.log(this.editProfileData.weekDays);
        this.availableMatrix[timeIndex][weekIndex] = !this.availableMatrix[timeIndex][weekIndex];
    }
    authLinkedIn(){
    	this.$window.open('/auth/linkedin', '_self');
    }


  //   toggleFormFunction (){
  //   	var toggleFormFlag = false;
  //   	toggleFormFlag = !toggleFormFlag;
		// if(toggleFormFlag == true){
		// 	$("#welcomeForm").show();
  //   		$("#msform").hide();
		// }
		// else{
		// 	$("#welcomeForm").hide();
  //   		$("#msform").show();
		// }
  //   }
	// stepInc(){
	
	// 	this.stepNo++;
	// 	if(this.stepNo>this.stepCompleted){
	// 		this.stepCompleted = this.stepNo;
	// 	}
	// 	if(this.stepNo===1){
	// 		this.submitRegistrationStep2();
	// 	}

		
	// }
	// stepDec(){
	// 	this.stepNo--;

	// }

	// submitRegistrationStep2(form){

	// 	// console.log(form);
	// 	this.submitted2 = true;
	// 	//var _this = this;
	// 	if (form.$valid) {
	// 		this.stepNo++;
	// 	}

	// }

	// submitRegistrationStep3(form){
	// 	this.submitted3 = true;
	// 	this.userInfo.type = 'registration';
	// 	var _this = this;
	// 	var i;

	// 	if (form.$valid) {

	// 		var fd = new FormData();
	// 		fd.append('file', _this.file[0], 'file');
	// 		// fd.append('email', 'seema_csedu33@yahoo.com');
	// 		for(var prop in this.userInfo){
				
	// 			if(this.userInfo[prop] instanceof Array){
	// 				if(prop === 'teachableLanguage'){
						
	// 					for(i=0;i<this.userInfo[prop].length;i++){
	// 						fd.append(prop,this.userInfo[prop][i]);
	// 					}
	// 				}
	// 				else{

	// 					for(i=0;i<this.userInfo[prop].length;i++){
	// 						fd.append(prop,JSON.stringify(this.userInfo[prop][i]));
	// 					}
	// 				}
					
	// 			}
	// 			else{
	// 				fd.append(prop,this.userInfo[prop]);
	// 			}
	// 		}
	// 	    this.$http.post('/api/users', fd, {
	// 	        transformRequest: angular.identity,
	// 	        headers: {'Content-Type': undefined}
	// 	    }).
	// 	   	then(function(data){

	// 	   		//console.log(data);
	// 	   		if(_this.resume){
	// 	   			var fd = new FormData();
	// 				fd.append('file', _this.resume[0], 'file');
	// 				fd.append('id',data.data._id);
	// 			  	_this.$http.post('/api/users/uploadResume', fd, {
	// 			        transformRequest: angular.identity,
	// 			        headers: {'Content-Type': undefined}
	// 			    }).
	// 			    then(function(){
	// 			    	_this.submitted3 = false;
	// 					_this.stepNo++;
	// 			    });
	// 	   		}
	// 	   		else{
	// 	   			_this.submitted3 = false;
	// 				_this.stepNo++;
	// 	   		}
	// 		});

	// 	}

	// }
	
	// upload(file){
	// 	//alert('ok');
	// 	this.file = file;
	// 	//console.log(file);
	// }

	// uploadResume(file){
	// 	this.resume = file;
	// }

	// submitRegistrationStep1(form){

	// 	this.submitted = true;

	// 	if(form.$valid){
	// 		var _this = this;
	// 		this.$http({method: 'POST', url:'/api/users/checkEmail', data: {email: _this.userInfo.email} }).
	// 			then(function(data){
	// 				if(data.data.error){
	// 					_this.errors = {};
	// 					form.email.$setValidity('mongoose', false);
	// 					_this.errors.email = 'The specified email address is already in use.';
	// 				}
	// 				else{
	// 					_this.stepNo++;
	// 				}
					
	// 			})
	// 		 .catch(err => {
	// 				err = err.data;

	// 			});
	// 	}
	// }


}

angular.module('hackasolutionApp')
	.controller('RegistrationController', RegistrationController);