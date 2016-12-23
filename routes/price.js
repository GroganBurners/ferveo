var mongoose = require('mongoose')
var Price = require('../models/price')

module.exports = function (app) {

    app.get('/api/prices', function (req, res, next) {
        Price.find({}, function (err, prices) {
            if (err) res.send(err);
            res.json(prices);
        })
    })

    app.post('/api/prices', function (req, res, next) {       
        // create price
        Price.create(req.body, function (err, price) {
            if (err) res.render('error', { error: 'Error creating price' })
            // reload collection
            res.redirect('/api/prices');
        });
    })

    app.get('/api/prices/:id', function (req, res, next) {
        console.log(req.params.id)
        Price.findById(req.params.id, function (err, price) {
            if (err)
                res.send(err);
            res.json(price);
            //res.render('price', { price: price[0] })
        });
    })

    

    app.delete('/api/prices/:id', function (req, res, next) {
        var id = req.params.id;
        Price.findByIdAndRemove(id, function (err, price) {
            if (err) res.render('error', { error: 'Error deleting price' });
            res.json({ message: 'Successfully deleted' });
        });
    })

    app.put('/api/prices/:id', function (req, res, next) {
        Price.findOneAndUpdate({ _id: req.params.id }, {$set:req.body}, {new: true}, function (err, price) {
            res.json(price);
        });
    })
};