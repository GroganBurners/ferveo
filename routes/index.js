const fs = require('fs')
const cont = require('../controllers')
const CustomerController = cont.Customer
const PriceController = cont.Price
const EmailController =cont.Email
const passportConfig = require('../config/passport')

module.exports = function (app) {
  app.use('/api/customers', passportConfig.ensureAuthenticated, new CustomerController().route())
  app.use('/api/prices', new PriceController().route())
  app.use('/api/email', new EmailController().route())

  fs.readdirSync(__dirname).forEach(function (file) {
    if (file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js') {
      return
    }
    var name = file.substr(0, file.indexOf('.'))
    require('./' + name)(app)
  })
}
