var mongoose = require('mongoose')
var Schema = mongoose.Schema
var invoiceItem = require('./common/line-item')

var invoiceSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [invoiceItem],
    totalVat: { type: Number, default: 0.00 },
    total: { type: Number, default: 0.00 }
})


invoiceSchema.pre('save', function(next) {
  let overallTotal = 0.00
  let overallVat = 0.00
  // All the items should give the total
  for(item in this.items){
    overallTotal += item.total 
    overallVat += item.subTotal * item.vatRate
  }

  this.total = overallTotal
  next()
})



module.exports = mongoose.model('Invoice', invoiceSchema)