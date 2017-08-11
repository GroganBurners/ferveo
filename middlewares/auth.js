const passport = require("passport");

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

exports.secureAPI = function(req, res, next) {
  passport.authenticate("jwt", { session: false }, function(err, user) {
    if (!user) {
      return res.send("Non valid JWT supplied\n");
    }
    next();
  })(req, res);
};
