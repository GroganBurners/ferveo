const BaseController = require('./base')
var mongoose = require('mongoose')
const Customer = require('../models/customer')
const Price = require('../models/price')
const EmailController = require('./email')
const SmsController = require('./sms')

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

module.exports.Email = EmailController
module.exports.Sms = SmsController