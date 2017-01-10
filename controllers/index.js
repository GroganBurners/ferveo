const BaseController = require('./base')
const Customer = require('../models/customer')
const Price = require('../models/price')
const MessageController = require('./message')
const AuthController = require('./auth')

module.exports.Customer = class CustomerController extends BaseController {
  constructor () {
    super(Customer, '_id')
  }
}

module.exports.Price = class PriceController extends BaseController {
  constructor () {
    super(Price, '_id')
  }
}

module.exports.Message = MessageController
module.exports.Auth = AuthController
