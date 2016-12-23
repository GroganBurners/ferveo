var mongoose = require("mongoose");
//mongoose.Promise = global.Promise; // ES6
mongoose.Promise = require('bluebird');
var Price = require('../models/price');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var assert = chai.assert;


describe('Test Prices API', function () {

    beforeEach(function (done) { //Before each test we empty the database
        Price.remove({}, function (err) {
            done();
        });
    });

    it('it should GET all the prices', function (done) {
        chai.request(server)
            .get('/api/prices')
            .end(function (err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });

    it('it should POST a price with just a name', function (done) {
        var pri = {
            name: "Gas Service"
        }
        chai.request(server)
            .post('/api/prices')
            .send(pri)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Successfully created');
                done();
            });
    });

    it('it should POST a price with junk property and it\'s not persisted', function (done) {
        var pri = {
            name: "Gas Service",
            fake_property: "ignored"
        }
        chai.request(server)
            .post('/api/prices')
            .send(pri)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Successfully created');
                res.body.should.have.property('price');
                res.body.price.should.have.property('name').eql('Gas Service');
                res.body.price.should.not.have.property('fake_property');
                done();
            });
    });

    it('it should POST a price with same name and it\'s an error', function (done) {
        var pri = new Price({ name: "Gas Service" });
        pri.save(function (err, price) {
            chai.request(server)
                .post('/api/prices')
                .send(pri)
                .end(function (err, res) {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Price Already Exists');
                    done();
                });
        });
    });

    it('it should GET a price by the given id', function (done) {
        var pr = new Price({ name: "Oil Price" });

        pr.save(function (err, price) {
            pri = new Price(price._doc)
            chai.request(server)
                .get('/api/prices/' + price._id)
                .send(price)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('price');
                    res.body.should.have.property('name');
                    res.body.should.have.property('_id').eql(price._id.toString());
                    done();
                });
        });
    });

    it('it should fail to GET a price by non-existing id', function (done) {
        chai.request(server)
            .get('/api/prices/' + 'non-existing-id')
            .send({})
            .end(function (err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Error getting price');
                done();
            });
    });

    it('it should UPDATE a price by the given id', function (done) {
        var pr = new Price({ name: "Gas Fire Price" });

        pr.save(function (err, price) {
            pri = new Price(price._doc)
            chai.request(server)
                .put('/api/prices/' + price._id)
                .send(price)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.price.should.have.property('_id').eql(price._id.toString());
                    res.body.price.should.have.property('name').eql('Gas Fire Price');
                    res.body.should.have.property('message').eql('Successfully updated price');
                    done();
                });
        });
    });

    it('it should fail to UPDATE a price with a non existant id', function (done) {
        var pr = new Price({ name: "Gas Fire Price" });

        chai.request(server)
            .put('/api/prices/' + 'non-existant-id')
            .send(pr)
            .end(function (err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Error updating price');
                done();
            });
    });

    it('it should DELETE a price by the given id', function (done) {
        var pr = new Price({ name: "Gas Fire Price" });

        pr.save(function (err, price) {
            pri = new Price(price._doc)
            chai.request(server)
                .delete('/api/prices/' + price._id)
                .send(price)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Successfully deleted');
                    res.body.price.should.have.property('name').eql('Gas Fire Price');
                    done();
                });
        });
    });

    it('it should try to DELETE a price by non-existing id', function (done) {
        chai.request(server)
            .delete('/api/prices/' + 'non-existing-id')
            .send({})
            .end(function (err, res) {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Error deleting price');
                done();
            });
    });


});