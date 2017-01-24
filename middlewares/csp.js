var csp = require('helmet-csp')

module.exports = function (app) {
  app.use(csp({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'"],
      formAction: ["'self'"],
      objectSrc: ["'none'"],
    }
  }))
}
