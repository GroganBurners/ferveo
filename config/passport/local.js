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
      criteria: { email: email }
    }
    User.findOne(options.criteria, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' })
      }
      user.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          return done(null, user)
        } else{
          return done(null, false, { message: 'Invalid password' })
        }
      })
    })
  }
)
