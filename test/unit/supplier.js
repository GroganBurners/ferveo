var Supplier = mongoose.model('Supplier')

describe('Unit Test Supplier Model', function () {
  it('should be invalid if name is empty', function (done) {
    var supplier = new Supplier()

    supplier.validate(function (err) {
      expect(err.errors.name).to.exist
      done()
    })
  })

  it('should be valid with just a name', function (done) {
    var supplier = new Supplier({name: 'ABC Boiler Parts Co.'})

    supplier.validate(function (err) {
      expect(err).to.not.exist
      done()
    })
  })
})
