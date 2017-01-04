var mongoose = require('mongoose')
var Schema = mongoose.Schema
var expenseItem = require('./common/line-item')

var expenseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    items: [expenseItem],
    totalVat: { type: Number, default: 0.00 },
    total: { type: Number, default: 0.00 }
})

module.exports = mongoose.model('Expense', expenseSchema)