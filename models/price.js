// The Price model

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var priceSchema = new Schema({
  id: ObjectId,
  name: { type: String, unique: true, required: true },
  date: { type: Date, default: Date.now },
  price: { type: Number, default: 0.0 },
  info: { type: String, default: null },
  summer_offer: { type: Boolean, default: false }
});

module.exports = mongoose.model("Price", priceSchema);
