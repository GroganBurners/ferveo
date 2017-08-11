var Supplier = mongoose.model("Supplier");
var Expense = mongoose.model("Expense");

describe("Unit Test Expense Model", function() {
  it("should fail with invalid supplier", function(done) {
    var expense = new Expense({
      supplier: "test",
      items: [{ desc: "Boiler Service and Repair", total: 80.0 }]
    });

    expense.validate(function(err) {
      expect(err.errors.supplier).to.exist;
      done();
    });
  });

  it("should fail with invalid line items", function(done) {
    var expense = new Expense({
      supplier: new Supplier({ name: "ABC Oil Gas Company" }),
      items: [{ test: "test" }]
    });

    expense.validate(function(err) {
      expect(err.errors).to.exist;
      done();
    });
  });

  it("should be valid with minimal data", function(done) {
    var expense = new Expense({
      supplier: new Supplier({ name: "ABC Oil Gas Supplier" }),
      items: [{ desc: "Boiler Service and Repair", total: 80.0 }]
    });

    expense.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });
});
