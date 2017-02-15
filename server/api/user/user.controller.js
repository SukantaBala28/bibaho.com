'use strict';

import User from './user.model';
import Registration from './registration.model';
import Notification from './notification.model';
import _l from 'lodash';
import nodemailer from 'nodemailer';
import uuid from 'node-uuid';
import randomstring from 'randomstring';
var stripe;
var unsubLink;
var socket;
//var sendMail = 
var transporter = nodemailer.createTransport("SMTP", {
	host: "smtpout.secureserver.net", // hostname
	secureConnection: true, // use SSL
	port: 465, // port for secure SMTP
	auth: {
			user: "sazzad@monistit.com",
			pass: "sazzad123"
	}
});

function validationError(res, statusCode) {
	statusCode = statusCode || 422;
	return function(err) {
		res.status(statusCode).json(err);
	}
}

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.status(statusCode).send(err);
	};
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
  	//console.log(entity);
  	//console.log(updates);
  	if(updates.cardHolderInfo){

  		if(updates.cardHolderInfo.length === 0){

  			entity.cardHolderInfo = [];
  			return entity.save()
		      .then(entity => {
		        return entity;
		      });
  		}

  	}
  	else{
  		var updated = _l.merge(entity, updates);
   		return updated.save()
	      .then(updated => {
	        return updated;
	      });
  	}
    
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
	//console.log('ok');
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
	return User.find({}, '-salt -password').exec()
	.then(users => {
	 
			res.status(200).json(users);
			// res.status(200).json(users);
	})
	.catch(handleError(res));
}

/**
	* check email already exists
	*/
export function checkEmail(req,res){

	var email = req.body.email;

	User.findOne({email: email}).exec(function(err,user){

		if(!err){

			if(user){
				res.json({error: true});
			}
			else{
				Registration.findOne({email: email}).exec(function(err,user){

					if(!err){
						if(user){
							res.json({error: true});
						}
						else{
							res.json({error: false});
						}
					}
				})
			}
		}
	})
	//console.log(req.body);
}

export function sendJoinFormEmail(req,res,next){
	var newUser;
	newUser = new Registration(req.body);
	if(req.file){
	 	newUser.resumePath = 'uploads/' + req.file.filename;
	 	//console.log(req.file.filename);
	}
	var host = req.headers.host;
	var link = 'http://'+host+'/'+req.file.filename;
	var mailOptions = {
		from:'info@hackasolution.com', // sender address
		to: req.body.email, // list of receivers
		subject: 'Join Form Email Confirmation and receiving resume.', // Subject line
		//attachments: [{filename:req.file.name, contents: req.file}]
		html: 'Dear CEO: <br/><br/>I am a new client. My information has been given below:<br/><br/><b>Email: </b>'+req.body.email+'<br/><br/><b>My Resume Link</b>: <a href="' + link + '">'+link+'</a><br/>'
		
		}
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
					return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});
	res.status(204).end();
}

export function sendGetASolutionEmail(req,res){

	var mailOptions = {
		from:'info@hackasolution.com', // sender address
		to: 'ceo@hackasolution.com', // list of receivers
		subject: 'Client Information', // Subject line
		//text: 'your request has bee accepted. Your password is: 1234', // plaintext body
		html: 'Dear CEO: <br/><br/>I am a new client. My information has been given below:<br/><br/><b>Name: </b>'+req.body.name+'<br/><b>Email: </b>'+req.body.email+'<br/> <b>Phohe: </b>'+req.body.phone
		// html body
		};
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
					return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});
	res.status(204).end();
}


export function registration(req,res){

	console.log(req.body);
	var newUser;
	newUser = new Registration(req.body);
	newUser.referenceId = uuid.v1();
	newUser.userType = 'hacker';
	if(req.file){
		//console.log(req.file);
		newUser.resumePath = 'uploads/' + req.file.filename;
	}
	newUser.save(function(err){
		if(err)
			console.log(err);
		else
			res.status(200).send();
	})
}

/**
 * Get my info
 */
export function me(req, res, next) {
	// console.log('seema');
	// console.log(req.user);
	var userId = req.user._id;

	return User.findOne({ _id: userId }, '-salt -password').exec()
		.then(user => { // don't ever give out the password or salt
			if (!user) {
				return res.status(401).end();
			}
			res.json(user);
		})
		.catch(err => next(err));
}


/**
	* Get All Notifications
	*/
export function getNotifications(req,res,next){
	
	Notification.find({$and: [{receiver: req.user._id}, {seenByReceiver : {$ne: req.user._id}}] }).exec(function(err,unseenNotifications){
		if(!err){
			
			Notification.find({receiver: req.user._id}).populate('sender', 'profilePicturePath firstName lastName').exec(function(err,notifications){
				if(!err){
					res.status(200).send({unseenNotifications: unseenNotifications, notifications: notifications});
				}
			})
		}
	})
}

export function getRegisteredUser(req, res){
	//console.log('comes here');
	return Registration.find({}, '-salt -password').exec()
		.then(registeredUsers => {

			res.status(200).json(registeredUsers);

		})
		.catch(handleError(res));
}

export function getUserRole(req, res, next) {

	if(req.user){
		var userId = req.user._id;
		return User.findOne({ _id: userId }, '-salt -password').exec()
			.then(user => { // don't ever give out the password or salt
				if (!user) {
					return res.status(401).end();
				}
				res.json(user);
			})
			.catch(err => next(err));
	}
	else{
		res.json({role: ''});
	}
}

/**
	* get user profile from user list
	*/
export function getUserProfile(req,res,next){
	// console.log('seema');
	// console.log(req.params);
	var id = req.params.userId;
	User.findOne({'_id' : id}, '-salt -password').exec()
		.then(user => { // don't ever give out the password or salt
			//console.log(users);
			if (!user) {
				Registration.findOne({'_id' : id}, '-salt -password').exec()
				.then(user => { // don't ever give out the password or salt
					//console.log(users);
					if (!user) {
						return res.status(401).end();
					}
					user.userFlag = true;
					user.accepted = false;
					res.json(user);
				})
				.catch(err => next(err));

			}
			else{
				user.accepted = true;
				res.json(user);
			}
		})
		
}

export function acceptRegisteredUser(req,res){
	//console.log(req.body);
	var host = req.headers.host;
	var link = 'http://' + host + '/login';
	var newUser;
	var password = randomstring.generate(7);
	newUser = new User({name: req.body.firstName, password: password, tutorFlag: true});
	var htmlText='Dear Tutor: <br/><br/> Congratulations, your application has been approved! '+
				 '<b> Your password is: </b>' + password + '<br/> <br/>'+
				 'At Hackasolution, our goal is to present only <u> the best </u> language tutors to our learner community, and we are delighted to welcome you to our family.' +
				 'We have created a basic profile for you, but we invite you to personalize it by ' +  
				 '<a href="' + link + '">clicking here</a>.<br/> <br/>'+
				 '<b> If you haven’t already, please upload a recent photo to your profile, or better yet, an introductory video! You will greatly increase your chances of being selected by a student; we also feature tutors on the main page from time to time, but only those who have linked intro videos.</b>'+
				 '<br/> <br/>Once again, a heartfelt welcome to the Hackasolution team! <br/> <br/> Sincerely, <br/>Jeff Myers<br/>CEO, Hackasolution'+
				 '<br/> <br/>Hackasolution Language Tutoring Services Inc., <br/> 439 University Avenue, Suite 2110, Toronto, Ontario M5G 1Y8 Canada';

	for(var prop in req.body){
		newUser[prop] = req.body[prop];
	}
	newUser.provider = 'local';
	newUser.role = 'user';
	newUser.save()
		.then(function(user) {
			return Registration.findByIdAndRemove(req.body._id).exec()
			.then(function() {
				res.status(204).end();
				var mailOptions = {
						from: 'info@Hackasolution.com', // sender address
						to: req.body.email, // list of receivers
						subject: 'Application Approved', // Subject line
						//text: 'your request has bee accepted. Your password is: 1234', // plaintext body
						html: htmlText
						// html body
				};
				transporter.sendMail(mailOptions, function(error, info){
						if(error){
								return console.log(error);
						}
						console.log('Message sent: ' + info.response);
				});
			})
			.catch(handleError(res));
		})
		.catch(validationError(res));
 

	//console.log(req.body);
}

/**
	*delete tutor who registered for acceptance
	*/
export function deleteRegisteredUser(req,res){
	//console.log(req.params);
	Registration.findOne({'email' : req.params.email}).exec(function(err,doc){
		if(!err && doc){
			Registration.findByIdAndRemove(doc._id).exec(function(data){

				if(req.body.noEmail !== true){
					var mailOptions = {
							from: 'info@Hackasolution.com', // sender address
							to: req.params.email, // list of receivers
							subject: 'APPLICATION DENIED MESSAGE', // Subject line
							//text: 'your request has bee accepted. Your password is: 1234', // plaintext body
							html: 'Dear Tutor: <br/><br/> Thank you for your application to be a tutor with Hackasolution.  After a thorough review, unfortunately it was not approved.  There are many reasons why an application can be rejected; for example, we may have too many tutors in the specific language you teach already, or your profile might not be exactly what we\'re looking for. <br/> <br/> We wish you luck in your future language learning and studying endeavours!  <br/> <br/> Sincerely,<br/> Hackasolution Team <br/> <br/>Hackasolution Language Tutoring Services Inc., 439 University Avenue, Suite 2110, Toronto, Ontario M5G 1Y8 Canada'
							// html body
					};
					transporter.sendMail(mailOptions, function(error, info){
							if(error){
									return console.log(error);
							}
							console.log('Message sent: ' + info.response);
					});

				}
				
				res.status(204).end();

			})

		}
		else{
			res.status(401).end();
		}
	})
}

export function saveForLaterRequest(req,res){

	//console.log(req.params);
	Registration.findOne({_id: req.params.userId}).exec(function(err,registration){

		if(!err && registration){

			registration.hourlyRate = Number(registration.hourlyRate) ? Number(registration.hourlyRate) : 0;
			registration.saveForLater = true;
			registration.save(function(err){
				if(err)
					console.log(err);
				else
					res.status(204).send();
			})	

		}
	})
}

export function retrievePassword(req,res){

	// console.log(req.body);

	User.findOne({'email': req.body.email}).exec(function(err,user){
		if(!err){

			if(user){

				var host = req.headers.host;
				var link = 'http://' + host + '/recoverPassword/' + user._id;

				var htmlText='Recovery Link: '+ '<a href="' + link + '">' + link + '</a><br/>' + 
						'<br/> <br/> Sincerely, <br/>Jeff Myers<br/>CEO, Lingo121'+
				 		'<br/> <br/>Lingo121 Language Tutoring Services Inc., <br/> 439 University Avenue, Suite 2110, Toronto, Ontario M5G 1Y8 Canada'; // plaintext body
				var mailOptions = {
						from: 'info@lingo121.com', // sender address
						to: req.body.email, // list of receivers
						subject: 'Password Recovery', // Subject line
						//text: 'your request has bee accepted. Your password is: 1234', // plaintext body
						html: htmlText
						// html body
				};
				transporter.sendMail(mailOptions, function(error, info){
						if(error){
								return console.log(error);
						}
						console.log('Message sent: ' + info.response);
						res.json({success: true});
				});

			}
			else{
				res.json({emailNotFound: true});
			}

		}
	})
}

export function authCallback(req,res){
	
}

