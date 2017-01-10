require('dotenv').config()
var env = process.env.NODE_ENV || 'development'
var config = require('./config')[env]

module.exports = config
module.exports.env = env
