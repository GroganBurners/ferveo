// The User model
var bcrypt = require('bcrypt')
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  password: { type: String, default: '' },
  authToken: { type: String, default: '' },
  google: {}
})


// Statics are on Model class
userSchema.statics = {

  /**
   * Load - DEPRECATED TODO: REMOVE
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name username email'
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb)
  }
}

// Method on user objects to compare password input to password saved
userSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

// Hash user password before saving new user
userSchema.pre('save', function(next) {
  var user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

module.exports = mongoose.model('User', userSchema)
