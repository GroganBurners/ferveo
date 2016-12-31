var chai = require('chai')
var server = require('../app')
/* eslint-disable no-unused-vars */
var should = chai.should()

describe('Test SMS API', function () {
  xit('it should send an sms', function (done) {
    var mail = {
      number: '+353873791474',
      message: 'Hello'
    }
    chai.request(server)
            .post('/api/sms')
            .send(mail)
            .end(function (err, res) {
              should.not.exist(err)
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('message').eql('Message sent')
              done()
            })
  })

  xit('it should fail to send an sms to invalid number', function (done) {
    var mail = {
      number: '+35386',
      message: 'Hello'
    }
    chai.request(server)
            .post('/api/sms')
            .send(mail)
            .end(function (err, res) {
              should.exist(err)
              res.should.have.status(404)
              res.body.should.be.a('object')
              res.body.should.have.property('message').eql('Error creating message')
              done()
            })
  })
})
