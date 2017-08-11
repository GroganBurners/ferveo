const cont = require("../controllers");
const CustomerController = cont.Customer;
const ExpenseController = cont.Expense;
const PriceController = cont.Price;
const MessageController = cont.Message;
const AuthController = cont.Auth;
const logger = require("winston");
const passportConfig = require("./passport");
const authMiddleware = require("../middlewares/auth");
const cacheMiddleware = require("../middlewares/cache");

module.exports = function(app) {
  // API
  app.use(
    "/api/customers",
    authMiddleware.secureAPI,
    new CustomerController().routeAPI()
  );
  app.use(
    "/api/prices",
    authMiddleware.secureAPI,
    new PriceController().routeAPI()
  );
  app.use(
    "/api/messages",
    authMiddleware.secureAPI,
    new MessageController().routeAPI()
  );
  app.use("/api/auth", new AuthController().routeAPI()); // Login via route, no security needed

  app.use("/auth", new AuthController().route());
  app.use("/customers", new CustomerController().route());
  app.use("/expenses", new ExpenseController().route());

  // Ordinary web pages
  app.get("/", cacheMiddleware(5 * 60), function(req, res, next) {
    res.render("home/home", { title: "Grogan Burner Services" });
  });

  // Testing Flash messages
  app.get("/flash", function(req, res) {
    req.flash("info", "Hi there!");
    res.redirect("/");
  });

  app.get("/no-flash", function(req, res) {
    res.redirect("/");
  });

  app.get("/multiple-flash", function(req, res) {
    req.flash("info", ["Welcome", "Please Enjoy"]);
    res.redirect("/");
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    logger.error(err.stack);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
};
