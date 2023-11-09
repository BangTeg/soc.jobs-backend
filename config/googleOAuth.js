// Define Google OAuth credentials
require('dotenv').config();
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    BE_PORT
} = process.env;

// config/googleOAuth.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `https://${BE_PORT}/auth/google/callback`,
  passReqToCallback: true
},
(request, accessToken, refreshToken, profile, done) => {
  // Use the profile information to create or authenticate a user in your system
  // You can access profile.id, profile.displayName, etc.
  // Call done() with the user object when done
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null,user);
});