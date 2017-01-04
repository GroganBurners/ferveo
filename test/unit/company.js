'use strict'
var mongoose = require('mongoose')
var Company = mongoose.model('Company')
var chai = require('chai')
var expect = chai.expect

describe('Unit Test Company Model', function () {
  it('should be invalid if name is empty', function (done) {
    var company = new Company()

    company.validate(function (err) {
      expect(err.errors.name).to.exist
      done()
    })
  })
})
