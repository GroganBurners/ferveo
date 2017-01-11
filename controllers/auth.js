var Router = require('express')
var passport = require('passport')
const passportConfig = require('../config/passport')

module.exports = class AuthController {

  route () {
    const router = new Router()
        // GET /auth/google
        //   Use passport.authenticate() as route middleware to authenticate the
        //   request.  The first step in Google authentication will involve
        //   redirecting the user to google.com.  After authorization, Google
        //   will redirect the user back to this application at /auth/google/callback
    router.get('/google', passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read']
    }))

        // GET /auth/google/callback
        //   Use passport.authenticate() as route middleware to authenticate the
        //   request.  If authentication fails, the user will be redirected back to the
        //   login page.  Otherwise, the primary route function function will be called,
        //   which, in this example, will redirect the user to the home page.
    router.get('/google/callback',
            passport.authenticate('google', {
              successRedirect: '/auth/account',
              failureRedirect: '/auth/login'
            }))

    router.get('/account', passportConfig.ensureAuthenticated, function (req, res) {
      res.render('account', { user: req.user })
    })

    router.get('/login', function (req, res) {
      res.render('login', { user: req.user })
    })

    router.get('/logout', function (req, res) {
      req.logout()
      res.redirect('/')
    })

    return router
  }
}