var winston = require("winston");
var config = require("./");
var env = config.env;

const tsFormat = () =>
  "[" +
  new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") +
  "]";

switch (env) {
  case "development": {
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {
      level: config.logLevel,
      prettyPrint: true,
      colorize: "all",
      timestamp: tsFormat,
      humanReadableUnhandledException: true
    });
    break;
  }

  case "production": {
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.File, {
      filename: "app.log",
      level: config.logLevel
    });
    break;
  }

  case "test": {
    winston.remove(winston.transports.Console);
    break;
  }
}

winston.info("ENV=", env);

module.exports = winston;
