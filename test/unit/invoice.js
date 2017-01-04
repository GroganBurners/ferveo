'use strict'
var mongoose = require('mongoose')
var Customer = mongoose.model('Customer')
var Invoice = mongoose.model('Invoice')
var chai = require('chai')
var expect = chai.expect

describe('Unit Test Invoice Model', function () {

  it('should be valid with minimal data', function (done) {
    var invoice = new Invoice({
        customer: new Customer({name: "Neil Grogan"}),
        items: [{desc: "Boiler Service and Repair", total: 80.00 }]
    })

    invoice.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })
})
