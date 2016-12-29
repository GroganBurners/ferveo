var mongoose = require('mongoose')
// mongoose.Promise = global.Promise; // ES6
mongoose.Promise = require('bluebird')
var Price = require('../models/price')

var chai = require('chai')
var server = require('../app')
/* eslint-disable no-unused-vars */
var should = chai.should()

describe('Test Prices API', function () {
  beforeEach(function (done) { // Before each test we empty the database
    Price.remove({}, function (err) {
      should.not.exist(err)
      done()
    })
  })

  it('it should GET all the prices (none in DB)', function (done) {
    chai.request(server)
            .get('/api/prices')
            .end(function (err, res) {
              should.not.exist(err)
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body.length.should.be.eql(0)
              done()
            })
  })

  it('it should GET all the prices (one in DB)', function (done) {
    var pri = new Price({ name: 'Gas Service' })
    pri.save(function (err, price) {
      chai.request(server)
                .get('/api/prices')
                .end(function (err, res) {
                  should.not.exist(err)
                  res.should.have.status(200)
                  res.body.should.be.a('array')
                  res.body.length.should.be.eql(1)
                  done()
                })
    })
  })

  it('it should GET all the prices (multiple in DB)', function (done) {
    var pr1 = new Price({ name: 'Gas Service' })
    var pr2 = new Price({ name: 'Oil Service' })
    Price.create(pr1, pr2, function (err, pr1, pr2) {
      chai.request(server)
                .get('/api/prices')
                .end(function (err, res) {
                  should.not.exist(err)
                  res.should.have.status(200)
                  res.body.should.be.a('array')
                  res.body.length.should.be.eql(2)
                  done()
                })
    })
  })

  it('it should POST a price with just a name', function (done) {
    var pri = {
      name: 'Gas Service'
    }
    chai.request(server)
            .post('/api/prices')
            .send(pri)
            .end(function (err, res) {
              should.not.exist(err)
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('message').eql('Successfully created')
              done()
            })
  })

  it('it should POST a price with junk property and it\'s not persisted', function (done) {
    var pri = {
      name: 'Gas Service',
      fake_property: 'ignored'
    }
    chai.request(server)
            .post('/api/prices')
            .send(pri)
            .end(function (err, res) {
              should.not.exist(err)
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('message').eql('Successfully created')
              res.body.should.have.property('price')
              res.body.price.should.have.property('name').eql('Gas Service')
              res.body.price.should.not.have.property('fake_property')
              done()
            })
  })

  it('it should POST a price with same name and it\'s an error', function (done) {
    var pri = new Price({ name: 'Gas Service' })
    var pr2 = { name: 'Gas Service' }
    pri.save(function (err, price) {
      chai.request(server)
                .post('/api/prices')
                .send(pr2)
                .end(function (err, res) {
                  should.exist(err)
                  res.should.have.status(409)
                  res.body.should.be.a('object')
                  res.body.should.have.property('message').eql('Price Already Exists')
                  done()
                })
    })
  })

  it('it should GET a price by the given id', function (done) {
    var pr = new Price({ name: 'Oil Price' })

    pr.save(function (err, price) {
      chai.request(server)
                .get('/api/prices/' + price._id.toString())
                .send(price)
                .end(function (err, res) {
                  should.not.exist(err)
                  res.should.have.status(200)
                  res.body.should.be.a('object')
                  res.body.should.have.property('price')
                  res.body.should.have.property('name')
                  res.body.should.have.property('_id').eql(price._id.toString())
                  done()
                })
    })
  })

  it('it should fail to GET a price by non-existing id', function (done) {
    chai.request(server)
            .get('/api/prices/' + 'non-existing-id')
            .send({})
            .end(function (err, res) {
              should.exist(err)
              res.should.have.status(404)
              res.body.should.be.a('object')
              res.body.should.have.property('message').eql('Error getting price')
              done()
            })
  })

  it('it should UPDATE a price by the given id', function (done) {
    var priceToBeUpdated = new Price({ name: 'Gas Fire Price' })

    priceToBeUpdated.save(function (err, price) {
      var updatesForPrice = { name: 'Gas Fire Price Updated'}
      chai.request(server)
                .put('/api/prices/' + updatesForPrice._id)
                .send(updatesForPrice)
                .end(function (err, res) {
                  console.log(err)
                  console.log('Status for res: ', res.status)
                  //res.should.have.status(200)
                  res.body.should.be.a('object')
                  res.body.price.should.have.property('_id').eql(updatesForPrice._id.toString())
                  res.body.price.should.have.property('name').eql('Gas Fire Price Updated')
                  res.body.should.have.property('message').eql('Successfully updated price')
                  done()
                })
    })
  })

  xit('it should fail to UPDATE a price with a non existant id', function (done) {
    var pr = { name: 'Gas Fire Price' }

    chai.request(server)
            .put('/api/prices/' + '41224d776a326fb40f000001')
            .send(pr)
            .end(function (err, res) {
              res.should.have.status(404)
              res.body.should.be.a('object')
              res.body.should.have.property('message').eql('Error updating price')
              done()
            })
  })

  it('it should DELETE a price by the given id', function (done) {
    var pr = new Price({ name: 'Gas Fire Price' })

    pr.save(function (err, price) {
      chai.request(server)
                .delete('/api/prices/' + price._id)
                .send(price)
                .end(function (err, res) {
                  should.not.exist(err)
                  res.should.have.status(200)
                  res.body.should.be.a('object')
                  res.body.should.have.property('message').eql('Successfully deleted')
                  res.body.price.should.have.property('name').eql('Gas Fire Price')
                  done()
                })
    })
  })

  it('it should try to DELETE a price by non-existing id', function (done) {
    chai.request(server)
            .delete('/api/prices/' + 'non-existing-id')
            .send({})
            .end(function (err, res) {
              should.exist(err)
              res.should.have.status(404)
              res.body.should.be.a('object')
              res.body.should.have.property('message').eql('Error deleting price')
              done()
            })
  })
})
