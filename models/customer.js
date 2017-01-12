var mongoose = require('mongoose')
var Schema = mongoose.Schema
var addressSchema = require('./common/address')
var phoneSchema = require('./common/phone')

var customerSchema = new Schema({
  name: { type: String, required: true },
  address: [addressSchema],
  phone: [phoneSchema],
  primaryAddress: { type: String, default: '' },
  primaryPhone: { type: String, default: '' },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
})

customerSchema.pre('save', function (next) {
  // change the updatedOn field to current date
  this.updatedOn = new Date()
  const address = this.address.toObject()
  if (typeof address !== 'undefined' && address.length > 0) {
    if (typeof address[0] !== 'undefined') {
      var values = ["street", "town", "county", "postCode", "country"];
      this.primaryAddress = values.filter(function (value, k) {
        if (address[0][value]) {
          return true; // skip
        }
        return false;
      }).map(function (k) { return address[0][k] }).join(", ")
    }
  }

  console.log(this)
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
