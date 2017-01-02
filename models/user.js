// The User model

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  google: {},
  isAdmin: Boolean
})


userSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name username'
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb)
  }
}

module.exports = mongoose.model('User', userSchema)
