var lineItem = {
  desc: { type: String, required: true },
  labour: { type: Boolean, required: false, default: false },
  vatRate: { type: Number, required: false, default: 0 },
  vatTotal: { type: Number, required: false, default: 0 },
  total: { type: Number, required: true }
}

module.exports = lineItem
