var mongoose = require('mongoose')
var Schema = mongoose.Schema
var addressSchema = require('./common/address')
var phoneSchema = require('./common/phone')

var customerSchema = new Schema({
  name: { type: String, required: true },
  address: [ addressSchema ],
  phone: [ phoneSchema ],
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
})

customerSchema.pre('save', function (next) {
  // change the updatedOn field to current date
  this.updatedOn = new Date()
  next()
})

module.exports = mongoose.model('Customer', customerSchema)
