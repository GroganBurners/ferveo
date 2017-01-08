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

/**
 * Statics
 */

customerSchema.statics = {

  /**
   * Find customer by id
   *
   * @param {ObjectId} id
   * @api private

  load: function (_id) {
    return this.findOne({ _id })
      .populate('name', 'address phone')
      .populate('customer.name')
      .exec();
  },*/

  /**
   * List customers
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {}
    const page = options.page || 0
    const limit = options.limit || 30
    return this.find(criteria)
      .populate('name', 'address phone')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec()
  }
}

module.exports = mongoose.model('Customer', customerSchema)
