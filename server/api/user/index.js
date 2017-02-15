'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
var storage = multer.diskStorage({
  	destination: function (req, file, cb) {
    	cb(null, 'client/uploads/')
  	},
  	filename: function (req, file, cb) {
    	crypto.pseudoRandomBytes(16, function (err, raw) {
      		cb(null, raw.toString('hex') + Date.now() + '.pdf');
    	});
  	}
});
var upload = multer({ storage: storage });

var router = new Router();

// router.get('/checkPaypal',controller.checkPaypal);
//router.get('/getTutorSameCityLanguage',auth.hasRole('learner'),controller.getTutorSameCityLanguage);
router.get('/', auth.hasRole('admin'), controller.index);
router.post('/retrievePassword',controller.retrievePassword);
router.post('/checkEmail', controller.checkEmail);
router.post('/registration', upload.single('file'), controller.registration);
router.post('/sendGetASolutionEmail',controller.sendGetASolutionEmail);
router.post('/sendJoinFormEmail',upload.single('file'), controller.sendJoinFormEmail);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/getNotifications', auth.isAuthenticated(), controller.getNotifications);
router.get('/getRegisteredUser', auth.hasRole('admin'), controller.getRegisteredUser);
router.get('/getUserRole', auth.getUser(),controller.getUserRole);
router.get('/getUserProfile/:userId', controller.getUserProfile);
router.post('/acceptRegisteredUser', auth.hasRole('admin'), controller.acceptRegisteredUser);
router.post('/deleteRegisteredUser/:email', auth.hasRole('admin'), controller.deleteRegisteredUser);
router.put('/saveForLaterRequest/:userId',auth.hasRole('admin'),controller.saveForLaterRequest);
module.exports = router;
