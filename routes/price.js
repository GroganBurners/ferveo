var Price = require('../models/price')

module.exports = function (app) {
  app.get('/api/prices', function (req, res, next) {
    Price.find({}, function (err, prices) {
      if (err) res.send(err)
      res.json(prices)
    })
  })

  app.post('/api/prices', function (req, res, next) {
    // create price
    Price.create(req.body, function (err, price) {
      if (err && err.code !== 11000) {
        console.log(err)
        console.log(err.code)
        res.json({ message: 'Error creating price: ' + err })
        return
      }

      // duplicate key
      if (err && err.code === 11000) {
        res.status(409)
        res.json({ message: 'Price Already Exists' })
        return
      }

      res.json({ message: 'Successfully created', price })
    })
  })

  app.get('/api/prices/:id', function (req, res, next) {
    Price.findById(req.params.id, function (err, price) {
      if (err) {
        res.status(404)
        res.json({ message: 'Error getting price', err })
        return
      }
      res.json(price)
    })
  })

  app.delete('/api/prices/:id', function (req, res, next) {
    var id = req.params.id
    Price.findByIdAndRemove(id, function (err, price) {
      if (err) {
        res.status(404)
        res.json({ message: 'Error deleting price' })
        return
      }
      res.json({ message: 'Successfully deleted', price })
    })
  })

  app.put('/api/prices/:id', function (req, res, next) {
    var id = req.params.id
    Price.findByIdAndUpdate(id, { $set: req.body }, { new: true }, function (err, price) {
      if (err === null && price === null) {
        res.status(404)
        res.json({ message: 'Error updating price' })
        return
      }
      res.json({ message: 'Successfully updated price', price })
    })
  })
}
