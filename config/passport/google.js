"use strict";
var mongoose = require("mongoose");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
var User = mongoose.model("User");
var config = require("../");
var logger = require("winston");

module.exports = new GoogleStrategy(
  {
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL:
      config.baseUrl +
      config.google.callbackPath /* ,
  passReqToCallback: true */
  },
  function(accessToken, refreshToken, profile, done) {
    const options = {
      criteria: { "google.id": profile.id }
    };
    User.findOne(options.criteria, function(err, user) {
      if (err) return done(err);
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: "google",
          google: profile._json
        });
        user.save(function(err) {
          logger.error("Error saving user: " + err);
          return done(err, user);
        });
      } else {
        logger.debug("Returning user : " + user);
        return done(err, user);
      }
    });
  }
);
