'use strict'
var mongoose = require('mongoose')
var LocalStrategy = require('passport-local').Strategy
var User = mongoose.model('User')

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    const options = {
      criteria: { email: email },
      select: 'name username email hashed_password salt'
    }
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' })
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' })
      }
      return done(null, user)
    })
  }
)
