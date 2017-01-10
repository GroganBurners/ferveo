'use strict'
var mongoose = require('mongoose')
var Company = mongoose.model('Company')
var Expense = mongoose.model('Expense')
var chai = require('chai')
var expect = chai.expect

describe('Unit Test Expense Model', function () {
  it('should fail with invalid company', function (done) {
    var expense = new Expense({
      company: 'test',
      items: [{ desc: 'Boiler Service and Repair', total: 80.00 }]
    })

    expense.validate(function (err) {
      expect(err.errors.company).to.exist
      done()
    })
  })

  it('should fail with invalid line items', function (done) {
    var expense = new Expense({
      company: new Company({name: 'ABC Oil Gas Company'}),
      items: [{test: 'test'}]
    })

    expense.validate(function (err) {
      expect(err.errors).to.exist
      done()
    })
  })

  it('should be valid with minimal data', function (done) {
    var expense = new Expense({
      company: new Company({name: 'ABC Oil Gas Company'}),
      items: [{ desc: 'Boiler Service and Repair', total: 80.00 }]
    })

    expense.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })
})
