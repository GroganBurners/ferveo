// globals
global.assert = require('assert')
global.chai = require('chai')
global.should = chai.should()
var server = require('../../app')
const User = require('../../models/user')

// setup
before((done) => {
    var userJSON = {
        email: 'test@test.com',
        password: 'test'
    }
    var user = new User(userJSON)
    user.save((err, user) => {
        chai.request(server)
            .post('/api/auth')
            .send(userJSON)
            .end(function (err, res) {
                should.not.exist(err)
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('token')
                global.token = res.body.token
                res.body.token.should.be.a('string')
                done()
            })
    })
});
//beforeEach();

// teardown
//after();
//afterEach();