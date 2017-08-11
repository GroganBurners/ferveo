var mongoose = require("mongoose");
var invoiceItem = require("./common/line-item");

var invoiceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  items: [invoiceItem],
  totalVat: { type: Number, default: 0.0 },
  total: { type: Number, default: 0.0 }
});

invoiceSchema.pre("save", function(next) {
  let overallTotal = 0.0;
  // let overallVat
  // All the items should give the total
  for (let item in this.items) {
    overallTotal += item.total;
    // overallVat += item.subTotal * item.vatRate
  }

  this.total = overallTotal;
  next();
});

function autopopulate(next) {
  this.populate("customer");
  next();
}

invoiceSchema.pre("find", autopopulate);
invoiceSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Invoice", invoiceSchema);
