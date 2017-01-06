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
    var transportStub = {
      sendMail: function (options) {
        return new Promise((resolve, reject) => { resolve(true, false) });
      }
    }

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
    var transportStub = {
      sendMail: function (options) {
        return new Promise((resolve, reject) => { reject(new Error('Something went wrong with mail service')) });
      }
    }
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
        err.should.have.property('message').eql('Not Found')
        mailerStub.restore()
        done()
      })
  })
})
