var winston = require('winston')
var config = require('./')
var env = config.env

winston.info('env is set', env)

switch (env) {
  case 'development': {
    winston.addColors({
      trace: 'magenta',
      input: 'grey',
      verbose: 'cyan',
      prompt: 'grey',
      debug: 'blue',
      info: 'green',
      data: 'grey',
      help: 'cyan',
      warn: 'yellow',
      error: 'red'
    })
    winston.remove(winston.transports.Console)
    winston.add(winston.transports.Console, {
      level: config.logLevel,
      prettyPrint: true,
      colorize: true,
      humanReadableUnhandledException: true
    })
    break
  }

  case 'production': {
    winston.remove(winston.transports.Console)
    winston.add(winston.transports.File, {
      filename: 'app.log',
      level: config.logLevel
    })
    break
  }

  case 'test': {
    winston.remove(winston.transports.Console)
    break
  }
}

module.exports = winston
