import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';

var NotificationSchema = new Schema({
		sender: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		receiver: [{
			type: Schema.ObjectId,
			ref: 'User'
		}],
		notificationType: String,
		seenByReceiver: [{
			type: Schema.ObjectId,
			ref: 'User'
		}],
		associatedBooking: 
		{
			type: Schema.ObjectId,
        	ref: 'Booking'
		},
		created: {
			type: Date, default: Date.now
		}
},{strict: false});


export default mongoose.model('Notification', NotificationSchema);
