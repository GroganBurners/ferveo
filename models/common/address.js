var address = {
  street: { type: String, required: true, default: '' },
  town: { type: String, required: false, default: '' },
  county: { type: String, default: 'Co. Kilkenny' },
  country: { type: String, default: 'Ireland' },
  postalCode: { type: String, required: false, default: '' }
}

module.exports = address
