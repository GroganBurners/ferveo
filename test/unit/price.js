'use strict'
var mongoose = require('mongoose')
var Price = mongoose.model('Price')
var chai = require('chai')
var expect = chai.expect

describe('Unit Test Price Model', function () {
  it('should be invalid if name is empty', function (done) {
    var price = new Price()

    price.validate(function (err) {
      expect(err.errors.name).to.exist
      done()
    })
  })
})
