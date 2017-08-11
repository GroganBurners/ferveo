var mongoose = require("mongoose");
var expenseItem = require("./common/line-item");

var expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },
  category: [
    "Purchases",
    "Motor Fuel",
    "Motor Serv/Repair",
    "Motor Tax/Ins",
    "Van DOE",
    "Public Laibility Insurance",
    "Advertising",
    "Tele/bband",
    "Training",
    "Office Expenses",
    "Sub Contractor",
    "Landfill",
    "Ber Cert Fees",
    "Bank Fees",
    "Sundry",
    "Heating",
    "Sponsorship",
    "Equipment Hire",
    "Electricity"
  ],
  items: [expenseItem],
  totalVat: { type: Number, default: 0.0 },
  totalExVat: { type: Number, default: 0.0 },
  total: { type: Number, default: 0.0 }
});

expenseSchema.pre("save", function(next) {
  let overallTotal = 0.0;
  // All the items should give the total
  this.items.forEach(function(item) {
    overallTotal = overallTotal + item.total;
  });

  this.total = overallTotal;
  next();
});

function autopopulate(next) {
  this.populate("supplier");
  next();
}

expenseSchema.pre("find", autopopulate);
expenseSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Expense", expenseSchema);
