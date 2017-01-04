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

  it('should be valid with just a name', function (done) {
    var company = new Company({name: "ABC Boiler Parts Co."})

    company.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })
})
