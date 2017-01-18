var Router = require('express')
var passport = require('passport')
const passportConfig = require('../config/passport')
const authMiddleware = require('../middlewares/auth')
let jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/user')

module.exports = class AuthController {

  route() {
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

    router.get('/account', authMiddleware.ensureAuthenticated, function (req, res) {
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

  routeAPI() {
    const router = new Router()

    router.post('/', (req, res) => {
      User.findOne({
        email: req.body.email
      }, function (err, user) {
        if (err) throw err;

        if (!user) {
          res.send({
            success: false,
            message: 'Authentication failed. User not found.'
          })
        } else {
          // Check if password matches
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              // Create token if the password matched and no error was thrown
              var token = jwt.sign(user, config.secure.privateKey, {
                expiresIn: "2 days"
              })
              res.json({
                success: true,
                message: 'Authentication successful',
                token
              })
            } else {
              res.send({
                success: false,
                message: 'Authentication failed. Passwords did not match.'
              })
            }
          })
        }
      })
    })

    return router
  }
}
