'use strict'
var mongoose = require('mongoose')
var GoogleStrategy = require('passport-google-oauth2').Strategy
var User = mongoose.model('User')


module.exports = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/google/callback' //,
    // passReqToCallback: true
  },
  function (accessToken, refreshToken, profile, done) {
    const options = {
      criteria: { 'google.id': profile.id }
    }
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'google',
          google: profile._json
        })
        user.save(function (err) {
          if (err) console.log(err)
          return done(err, user)
        })
      } else {
        return done(err, user)
      }
    })
  }
)
