var chai = require('chai')
var server = require('../../app')
var expect = chai.expect
var nock = require('nock')
/* eslint-disable no-unused-vars */
var should = chai.should()

describe('Auth logged out', function () {
  it('login page loads correctly', function (done) {
    chai.request(server)
      .get('/auth/login')
      .end(function (err, res) {
        should.not.exist(err)
        res.should.have.status(200)
        done()
      })
  })

  it('Account page logged out redirects', (done) => {
    chai.request(server)
      .get('/auth/account').end(function (err, res) {
        should.not.exist(err)
        expect(res.redirects[0]).to.match(/\/auth\/login/)
        expect(res).to.redirect
        done()
      })
  })

  it('google endpoint redirects', function (done) {
    chai.request(server)
      .get('/auth/google')
      .end(function (err, res) {
        should.exist(err)
        expect(res.redirects[0]).to.contain('https://accounts.google.com/o/oauth2/auth')
        expect(res).to.redirect
        done()
      })
  })

  it('it should end the session and show login', function (done) {
    chai.request(server)
      .get('/auth/logout')
      .end(function (err, res) {
        should.not.exist(err)
        expect(res.redirects[0]).to.match(/\/$/)
        expect(res).to.redirect
        // If successful layout displays Login links
        // TODO expect(res.text).to.match(/Contact/)
        done()
      })
  })
})

describe('GET /auth/google/callback', () => {
  beforeEach(function () {
    nock('https://accounts.google.com')
      .post('/o/oauth2/token')
      .reply(200, {
        access_token: 'test123828',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test22912'
      })
    nock('https://www.googleapis.com')
      .get('/plus/v1/people/me')
      .query(true)
      .reply(200, {
        id: '1234567890',
        displayName: 'Test User',
        emails: ['neil@grogan.ie'],
        username: 'dueyfinster'
      })
  })

  afterEach(function () {
    nock.cleanAll()
  })

  it('Login works and shows account', (done) => {
    var agent = chai.request.agent(server)
    try {
      agent
        .get('/auth/google/callback?code=xxxxxxxx&authuser=0&session_state=xxxxxxxx&prompt=consent')
        .then(function (res) {
              res.should.have.status(200)
              res.text.should.include('Test User')
              done()
        }).catch((error) => {
          done(error)
        })
    } catch (error) {
      done(error)
    }
  })
})
