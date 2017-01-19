var Customer = mongoose.model('Customer')

describe('Unit Test Customer Model', function () {
  it('should be invalid if name is empty', function (done) {
    var customer = new Customer()

    customer.validate(function (err) {
      expect(err.errors.name).to.exist
      done()
    })
  })

  it('should be valid if it has a name', function (done) {
    var customer = new Customer({ name: 'Neil Grogan' })

    customer.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })
})
