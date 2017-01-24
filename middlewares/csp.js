var csp = require('helmet-csp')

module.exports = function (app) {
  app.use(csp({
    directives: {
      defaultSrc: ["'self'"]
    }
  }))
}
