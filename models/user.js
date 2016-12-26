// The User model

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

var userSchema = new Schema({
  id: ObjectId,
  google_id: String,
  username: String,
  added_date: {type: Date, default: Date.now},
  name: String,
  email: String,
  isAdmin: Boolean
})

module.exports = mongoose.model('User', userSchema)
