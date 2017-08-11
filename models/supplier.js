var mongoose = require("mongoose");
var addressSchema = require("./common/address");
var phoneSchema = require("./common/phone");

var supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  regNo: { type: String, required: false },
  vatNo: { type: String, required: false },
  addresses: [addressSchema],
  phone: [phoneSchema],
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});

// on every save, add the date
supplierSchema.pre("save", function(next) {
  // change the updated_at field to current date
  this.updatedOn = new Date();
  next();
});

module.exports = mongoose.model("Supplier", supplierSchema);
