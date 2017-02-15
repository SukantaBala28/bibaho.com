// 'use strict';

import crypto from 'crypto';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import {Schema} from 'mongoose';
import User from './user.model';
const authTypes = ['github', 'twitter', 'facebook', 'google'];

var registrationSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  filename: String,
  file:String,
  name: String,
  phone: String,
  role: {
    type: String,
    default: 'user'
  },
  userType: String,
  password: String,
  country: String,
  city: String,
  timezone: String,
  aboutme: String,
  portfolioUrl: String,
  linkedinProfile: String,
  githubUsername: String,
  bestworkUrl: String,
  availableMatrix: [],
  currentJobTitle: String,
  currentCompany: String,
  companyWebsite: String,
  preferredProjects: String,
  resumePath: String,
  skill: String,
  subSkill: String,
  referenceId: String,
  linkedin: {}

},{strict: false});

registrationSchema
  .path('firstName')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return email.length;
  }, 'Email cannot be blank');

registrationSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return email.length;
  }, 'Email cannot be blank');

registrationSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    return this.constructor.findOne({ email: value }).exec()
      .then(function(user) {
        if (user) {
          if (self.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        else{
          return User.findOne({ email: value }).exec()
          .then(function(user) {
            if (user) {
              if (self.id === user.id) {
                return respond(true);
              }
              return respond(false);
            }
            return respond(true);
          })
          .catch(function(err) {
            throw err;
          });
        }
        return respond(true);
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified email address is already in use.');



var validatePresenceOf = function(value) {
  return value && value.length;
};

export default mongoose.model('Registration', registrationSchema);