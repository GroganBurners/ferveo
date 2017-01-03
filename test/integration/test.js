var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = chai.expect
var server = server = require('../../app')

chai.use(chaiHttp)

describe('Testing Grogan Burners', function () {
  it('fails, as expected', function (done) {
    chai.request(server)
      .get('/not-exist')
      .end(function (res) {
        expect(res).to.have.status(404)
        done()
      })
  })

  it('succeeds silently!', function (done) {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        if (err) {
          console.log(err.stack)
        }
        expect(res).to.have.status(200)
        done()
      })
  })
})
