'use strict'
var mongoose = require('mongoose')
var Company = mongoose.model('Company')
var Expense = mongoose.model('Expense')
var chai = require('chai')
var expect = chai.expect

describe('Unit Test Expense Model', function () {

  it('should be valid with minimal data', function (done) {
    var expense = new Expense({
        company: new Company({name: "ABC Oil Gas Company"}),
        items: [{desc: "Boiler Service and Repair", total: 80.00 }]
    })

    expense.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })
})
