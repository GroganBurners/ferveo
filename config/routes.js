const cont = require('../controllers')
const CustomerController = cont.Customer
const PriceController = cont.Price
const MessageController = cont.Message
const AuthController = cont.Auth
const passportConfig = require('./passport')

function cacheMiddleware(seconds){
  return function (req, res, next) {
    res.setHeader("Cache-Control", "public, max-age="+seconds)
    next()
  }
}

module.exports = function (app) {
  // API
  app.use('/api/customers', new CustomerController().routeAPI())
  app.use('/customers', new CustomerController().route())
  app.use('/api/prices', new PriceController().routeAPI())
  app.use('/api/messages', new MessageController().routeAPI())

  app.use('/auth', new AuthController().route())

  // Ordinary web pages
  app.get('/', cacheMiddleware(5 * 60), function (req, res, next) {
    res.render('home/home', { title: 'Grogan Burner Services' })
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
