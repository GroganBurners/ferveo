var chai = require('chai')
var server = require('../app')
/* eslint-disable no-unused-vars */
var should = chai.should()

describe('Test Email API', function () {
  xit('it should send an email', function (done) {
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
              res.body.should.have.property('message').eql('Successfully created')
              done()
            })
  })
})
