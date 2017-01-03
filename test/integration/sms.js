var chai = require('chai')
var server = require('../../app')
/* eslint-disable no-unused-vars */
var should = chai.should()
var nock = require('nock')

describe('Test SMS API', function () {

  it('it should send an sms', function (done) {
    nock('https://www.my-cool-sms.com')
      .get('/api-socket.php')
      .reply(200, {
        "success": true,
        "smsid": "ce184cc0a6d1714d1ac763f4fe89f521",
        "body": "Have a nice day!",
        "bodyucs2": "0048006100760065002000610020006E00690063006500200064",
        "bodygsm7": "486176652061206E6963652064617921",
        "number": "+491234567890",
        "senderid": "+449876543210",
        "senderidenabled": true,
        "unicode": false,
        "numchars": 321,
        "escapenumchars": 0,
        "smscount": 3,
        "charge": 0.112,
        "balance": 752.121,
        "countrycode": "IE",
        "prefix": "+353",
        "timestamp": "2017-04-02T22:27:22-07:00",
        "callbackurl": "https://www.groganburners.ie/api/sms/callback"
      })

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
        nock.cleanAll()
        done()
      })
  })

  it('it should fail to send an sms to invalid number', function (done) {
    nock('https://www.my-cool-sms.com')
      .get('/api-socket.php')
      .reply(200, {
        success: false,
        errorcode: "210",
        description: "The number seems to be invalid"
      })
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
        nock.cleanAll()
        done()
      })
  })
})