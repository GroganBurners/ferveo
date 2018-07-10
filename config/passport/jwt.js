var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var config = require("../");
var mongoose = require("mongoose");
var LocalStrategy = require("passport-local").Strategy;
var User = mongoose.model("User");

module.exports = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: config.secure.privateKey
  },
  (jwt_payload, done) => {
    User.findOne(
      {
        id: jwt_payload.id
      },
      (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      }
    );
  }
);
