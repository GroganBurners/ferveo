const fs = require('fs')
const cont = require('../controllers')
const CustomerController = cont.Customer
const PriceController = cont.Price
const EmailController = cont.Email
const SmsController = cont.Sms
const AuthController = cont.Auth
const passportConfig = require('../config/passport')

module.exports = function (app) {

  // API
  app.use('/api/customers', passportConfig.ensureAuthenticated, new CustomerController().route())
  app.use('/api/prices', new PriceController().route())
  app.use('/api/email', new EmailController().route())
  app.use('/api/sms', new SmsController().route())

  app.use('/auth', new AuthController().route())

  // Ordinary web pages
  app.get('/', function (req, res, next) {
    res.render('carousel', { title: 'Grogan Burner Services' })
  })

  // Testing Flash messages
  app.get('/flash', function (req, res) {
    req.flash('info', 'Hi there!')
    res.redirect('/')
  })

  app.get('/no-flash', function (req, res) {
    res.redirect('/')
  })

  app.get('/multiple-flash', function (req, res) {
    req.flash('info', ['Welcome', 'Please Enjoy'])
    res.redirect('/')
  })
}
