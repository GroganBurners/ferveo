var config = require('./config')
var express = require('express')
var path = require('path')
var logger = require('./config/logger')
var morgan = require('morgan')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var flash = require('connect-flash')
var mongoose = require('mongoose')

var app = express()

require('./models')(app)

/**
 * API keys and Passport configuration.
 */
var passport = require('passport')
require('./config/passport')

// connect to Mongo when the app initializes
mongoose.connect(config.db)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (config.env === 'development') {
  app.use(morgan('dev', { stream: { write: message => logger.info(message) } }))
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message) } }))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: config.cookieSecret,
  name: config.sessionName,
  proxy: true,
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())
require('./config/routes')(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
