// Auth
var passport = require("passport");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var jwt = require("./passport/jwt");
var local = require("./passport/local");
var google = require("./passport/google");

// serialize sessions
passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser((id, cb) => User.load({ criteria: { _id: id } }, cb));

// use these strategies
passport.use(jwt);
passport.use(local);
passport.use(google);
