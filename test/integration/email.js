var chai = require('chai')
var server = require('../../app')
/* eslint-disable no-unused-vars */
var should = chai.should()
var nock = require('nock')
var nodemailer = require('nodemailer')
var sinon = require('sinon')
var expect = require('chai').expect

describe('Test Email API', function () {
  it('it should send an email', function (done) {
    var transportStub = { sendMail: function (options, callback) { callback(false, true) } }
    var sendMailSpy = sinon.spy(transportStub, 'sendMail')
    var mailerStub = sinon.stub(nodemailer, 'createTransport').returns(transportStub)

    var mail = {
      to: 'neil@grogan.ie',
      subject: 'Hello ✔',
      text: 'Hello world 🐴',
      html: '<b>Hello world 🐴</b>'
    }
    chai.request(server)
      .post('/api/email')
      .send(mail)
      .end(function (err, res) {
        should.not.exist(err)
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eql('Message sent')
        mailerStub.restore()
        done()
      })
  })


  it('it should send an email', function (done) {
    var transportStub = { sendMail: function (options, callback) { callback(true, false) } }
    var sendMailSpy = sinon.spy(transportStub, 'sendMail')
    var mailerStub = sinon.stub(nodemailer, 'createTransport').returns(transportStub)

    var mail = {
      to: 'neil@grogan.ie',
      subject: 'Hello ✔',
      text: 'Hello world 🐴',
      html: '<b>Hello world 🐴</b>'
    }
    chai.request(server)
      .post('/api/email')
      .send(mail)
      .end(function (err, res) {
        should.exist(err)
        res.should.have.status(404)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eql('Error creating message')
        mailerStub.restore()
        done()
      })
  })
})
