const cont = require('../controllers')
const CustomerController = cont.Customer
const PriceController = cont.Price
const MessageController = cont.Message
const AuthController = cont.Auth
const passportConfig = require('./passport')

module.exports = function (app) {

  // API
  app.use('/api/customers', passportConfig.ensureAuthenticated, new CustomerController().route())
  app.use('/api/prices', new PriceController().route())
  app.use('/api/messages', new MessageController().route())

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
