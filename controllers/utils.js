const env = require("../config").env;
const logger = require("winston");

/**
  Returns a function that will write the result as a JSON to the response
*/
module.exports.ok = function(res) {
  return data => {
    logger.debug("Returning JSON data to client: " + data);
    res.json(data);
  };
};

/**
  Depending on the error type, will perform the following:
  Object was not found - 404 Not Found
  Invalid or missing input parameter - 400 Bad request
  Not enough privileges - 401 Unauthorized
  Unknown error - 500 Internal server error
*/
module.exports.fail = function(res) {
  return error => {
    logger.error(error);
    res.sendStatus(404).end();
  };
};

module.exports.respond = function(res, tpl, obj, status) {
  res.format({
    html: () => res.render(tpl, obj),
    json: () => {
      if (status) return res.status(status).json(obj);
      res.json(obj);
    }
  });
};

module.exports.respondOrRedirect = function respondOrRedirect(
  { req, res },
  url = "/",
  obj = {},
  flash
) {
  res.format({
    html: () => {
      if (req && flash) req.flash(flash.type, flash.text);
      res.redirect(url);
    },
    json: () => res.json(obj)
  });
};
