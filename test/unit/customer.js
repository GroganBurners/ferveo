'use strict'
var mongoose = require('mongoose')
var Customer = mongoose.model('Customer')
var chai = require('chai')
var expect = chai.expect

describe('Unit Test Customer Model', function () {
  it('should be invalid if name is empty', function (done) {
    var customer = new Customer()

    customer.validate(function (err) {
      expect(err.errors.name).to.exist
      done()
    })
  })
})
