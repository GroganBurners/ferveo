var request = require('request')

module.exports = function (app) {
  app.post('/api/sms', function (req, res, next) {
    var data = {
      'username': process.env.SMS_USER,
      'password': process.env.SMS_PASS,
      'function': 'sendSms',
      'number': req.body.number,
      'message': req.body.message,
      'senderid': 'GrogBurners'
    }

    request('https://www.my-cool-sms.com/api-socket.php', { json: true, body: data }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (body.success) {
          res.json({ message: 'Message sent', body })
          return
        }
        res.status(404)
        res.json({ message: 'Error creating message', body })
      }
    })
  })
}
