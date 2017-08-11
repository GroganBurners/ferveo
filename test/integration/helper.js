// globals
/* eslint-disable no-unused-vars */
global.assert = require("assert");
global.chai = require("chai");
global.expect = chai.expect;
global.should = chai.should();
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
global.nock = require("nock");
global.server = require("../../app");
global.mongoose = require("mongoose");
global.mongoose.Promise = require("bluebird");
global.logger = require("winston");
global.sinon = require("sinon");
const User = require("../../models/user");

// setup
before(done => {
  var userJSON = {
    email: "test@test.com",
    password: "test"
  };
  var user = new User(userJSON);
  user.save((err, user) => {
    chai
      .request(server)
      .post("/api/auth")
      .send(userJSON)
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token");
        global.token = res.body.token;
        res.body.token.should.be.a("string");
        done();
      });
  });
});
//beforeEach();

// teardown
//after();
//afterEach();
