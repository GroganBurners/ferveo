var address = { 
    type: String, 
    street: String, 
    city: String, 
    state: String, 
    country: { type: String, default: 'Ireland' }, 
    postalCode: { type: String, required: false, default: '' },
}


module.exports = address