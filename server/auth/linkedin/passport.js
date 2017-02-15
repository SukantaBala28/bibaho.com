import passport from 'passport';
import {Strategy as LinkedinStrategy} from 'passport-linkedin-oauth2';

export function setup(User, Registration, config) {
  passport.use(new LinkedinStrategy({
      clientID: config.linkedin.clientID, 
      clientSecret: config.linkedin.clientSecret, 
      callbackURL: config.linkedin.callbackURL, 
      scope: ['r_emailaddress', 'r_basicprofile'], 
      passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    //console.log(profile);
    //console.log(accessToken);
    Registration.findOne({'linkedin.id': profile.id}).exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }

        user = new Registration({
          firstName: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'linkedin',
          linkedin: profile._json
        });
        user.save()
          .then(user => done(null, user))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
