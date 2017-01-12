var Router = require('express')
var pluralize = require('pluralize')
var ok = require('./utils').ok
var fail = require('./utils').fail
var respond = require('./utils').respond
const logger = require('winston')
const MAX_RESULTS = 100

/**
  Generic controller that provides CRUD operations for a given Mongoose model
*/
module.exports = class BaseController {

  /**
    @param model Mongoose model
    @param key primary key of the model that will be used for searching, removing
    and reading
  */
  constructor(model, key) {
    this.model = model
    this.modelName = model.modelName.toLowerCase()
    this.key = key
  }

  create(data) {
    return this.model
      .create(data)
      .then((modelInstance) => {
        var response = {}
        response[this.modelName] = modelInstance
        return response
      })
  }

  read(id) {
    var filter = {}
    filter[this.key] = id

    return this.model
      .findOne(filter)
      .lean()
      .then((modelInstance) => {
        var response = {}
        response[this.modelName] = modelInstance
        return response
      })
  }

  list() {
    return this.model
      .find({})
      .lean()
      .limit(MAX_RESULTS)
      .then((modelInstances) => {
        var response = {}
        response[pluralize(this.modelName)] = modelInstances
        return response
      })
  }

  delete(id) {
    const filter = {}
    filter[this.key] = id

    return this.model
      .remove(filter)
      .then(() => {
        return {}
      })
  }

  /**
   */
  update(id, data) {
    var filter = {}
    filter[this.key] = id

    return this.model
      .findOne(filter)
      .then((modelInstance) => {
        for (var attribute in data) {
          if (data.hasOwnProperty(attribute) && attribute !== this.key && attribute !== '_id') {
            modelInstance[attribute] = data[attribute]
          }
        }

        return modelInstance.save()
      })
      .then((modelInstance) => {
        var response = {}
        response[this.modelName] = modelInstance
        return response
      })
  }

  search(text) {
    var queryArray = []

    for (var property in this.model.schema.paths) {
      if (this.model.schema.paths.hasOwnProperty(property) && this.model.schema.paths[property]["instance"] === "String") {
        queryArray.push(JSON.parse('{\"' + property + '\": { \"$regex\": "' + text + '", \"$options\": \"i\"} }'))
      }
    }

    var query = {
      $or: queryArray
    }

    return this.model.find(query).lean().exec().then((modelInstances) => {
      var response = {}
      response[pluralize(this.modelName)] = modelInstances
      return response
    })
  }

  /**
   *  ROUTERS
   */

  routeAPI() {
    const router = new Router()

    router.get('/', (req, res) => {
      this
        .list()
        .then(ok(res))
        .then(null, fail(res))
    })

    router.post('/', (req, res) => {
      this
        .create(req.body)
        .then(ok(res))
        .then(null, fail(res))
    })

    router.post('/search', (req, res) => {
      this
        .search(req.body.text)
        .then(ok(res))
        .then(null, fail(res))
    })


    router.get('/:key', (req, res) => {
      this
        .read(req.params.key)
        .then(ok(res))
        .then(null, fail(res))
    })

    router.put('/:key', (req, res) => {
      this
        .update(req.params.key, req.body)
        .then(ok(res))
        .then(null, fail(res))
    })

    router.delete('/:key', (req, res) => {
      this
        .delete(req.params.key)
        .then(ok(res))
        .then(null, fail(res))
    })

    return router
  }

  route() {
    const router = new Router()

    // Declare locals to use
    router.use((req, res, next) => {
      res.locals.moment = require('moment')
      next()
    })

    router.get('/', (req, res) => {
      this
        .list()
        .then((list) => {
          let pageProps = {
            title: this.model.modelName
          }
          respond(res, this.modelName + '/index', Object.assign(pageProps, list))
        })
        .then(null, fail(res))
    })

    router.get('/new', (req, res) => {
      res.render(this.modelName + '/new', { title: 'Add New ' + this.model.modelName });
    })

    router.post('/search', (req, res) => {
      this
        .search(req.body.text)
        .then((list) => {
          let pageProps = {
            title: this.model.modelName + " search for: " + req.body.text
          }
          respond(res, this.modelName + '/index', Object.assign(pageProps, list))
        })
        .then(null, fail(res))
    })

    router.post('/', (req, res) => {
      logger.info('Will create the object: ' + JSON.stringify(req.body))
      this
        .create(req.body)
        .then(res.redirect('/' + pluralize(this.modelName)))
        .then(null, fail(res))
    })

    router.get('/:key', (req, res) => {
      this
        .read(req.params.key)
        .then(obj => {
          let pageProps = {
            title: this.model.modelName
          }
          respond(res, this.modelName + '/show', Object.assign(pageProps, obj))
        })
        .then(null, fail(res))
    })


    router.route('/:key/edit').get((req, res) => {
      this
        .read(req.params.key)
        .then((obj) => {
          let pageResp = {
            title: this.model.modelName
          }
          pageResp[this.modelName] = obj[this.modelName].toObject()
          respond(res, this.modelName + '/edit', pageResp)
        })
        .then(null, fail(res))
    }).delete((req, res) => {
      logger.info('Will delete the object: ' + req.body.key)
      this
        .delete(req.body.key)
        .then(res.redirect('/' + pluralize(this.modelName)))
        .then(null, fail(res))
    }).put((req, res) => {
      logger.info('Will update the object: ' + req.params.id)
      this
        .update(req.body.id, req.body)
        .then(res.redirect('/' + pluralize(this.modelName) + '/' + req.params.key))
        .then(null, fail(res))
    })
    // TODO PUT and DELETE for Edit opeation

    return router
  }
}
