const config = require('./config')
const express = require('express')
const path = require('path')
const logger = require('./config/logger')
const morgan = require('morgan')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const csp = require('./middlewares/csp')
const app = express()

require('./models')(app)
//csp(app)

/**
 * API keys and Passport configuration.
 */
const passport = require('passport')
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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        logger.info('In method override')
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))
app.use(cookieParser())
app.use(session({
  secret: config.secure.privateKey,
  name: config.secure.sessionName,
  proxy: true,
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
//app.use(csrf())
//app.use(cors())
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())
require('./config/routes')(app)

module.exports = app
