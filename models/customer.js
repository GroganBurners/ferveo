var mongoose = require('mongoose')
var Schema = mongoose.Schema
var addressSchema = require('./common/address')

var customerSchema = new Schema({ 
    name: { type: String, required: true }, 
    address: [ addressSchema ], 
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now }
})

// on every save, add the date
customerSchema.pre('save', function(next) {
  // change the updated_at field to current date
  this.updatedOn = new Date()
  next()
})

module.exports = mongoose.model('Customer', customerSchema)
