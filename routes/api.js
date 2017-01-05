var CustomerController = require('../controllers').Customer
var PriceController = require('../controllers').Price
const passportConfig = require('../config/passport')

module.exports = function (app) {
  app.use('/api/customers', passportConfig.ensureAuthenticated, new CustomerController().route())
  app.use('/api/prices', new PriceController().route())

}
