var passport = require('passport')
const passportConfig = require('../config/passport')

module.exports = function (app) {
  // GET /auth/google
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Google authentication will involve
  //   redirecting the user to google.com.  After authorization, Google
  //   will redirect the user back to this application at /auth/google/callback
  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read']
  }))

  // GET /auth/google/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/account',
      failureRedirect: '/auth/login'
    }))

  app.get('/account', passportConfig.ensureAuthenticated, function (req, res) {
    console.log(req)
    res.render('account', { user: req.user })
  })

  app.get('/auth/login', function (req, res) {
    res.render('login', { user: req.user })
  })

  app.get('/auth/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })
}
