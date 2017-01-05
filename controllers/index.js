const BaseController = require('./base')
var mongoose = require('mongoose')
const Customer = require('../models/customer')
const Price = require('../models/price')

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
