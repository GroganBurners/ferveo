const nodemailer = require('nodemailer')
const Router = require('express')
const config = require('../config')
const logger = require('winston')
var rp = require('request-promise')
var ok = require('./utils').ok
var fail = require('./utils').fail

module.exports = class MessageController {
  constructor () {
    this.smtpConfig = {
      host: config.mail.server,
      port: config.mail.port,
      secure: true, // use SSL
      auth: {
        user: config.mail.username,
        pass: config.mail.password
      }
    }
  }

  sendSMS (sms) {
    var data = {
      'username': config.sms.username,
      'password': config.sms.password,
      'function': 'sendSms',
      'number': sms.number,
      'message': sms.message,
      'senderid': 'GrogBurners'
    }

    return rp('https://www.my-cool-sms.com/api-socket.php', { json: true, body: data })
            .then((resp) => {
              if (resp.hasOwnProperty('errorcode')) {
                logger.error('Send SMS failed: ' + resp.description)
                throw new Error('SMS Send failed!')
              } else {
                logger.info('SMS Sent to: ' + JSON.Stringify(resp))
                logger.debug('SMS Sent: ' + JSON.Stringify(resp))
                return { message: 'Message sent' }
              }
            })
        /* .catch((err) => {
            return new Error('Error creating message: ' + err)
        }); */
  }

  sendTestEmail (body) {
    const mailOptions = {
      from: '"' + config.mail.from.name + '" <' + config.mail.from.address + '>', // sender address
      to: body.to, // list of receivers
      subject: body.subject, // Subject line
      text: body.text, // plaintext body
      html: body.html // html body
    }
    return this.send(mailOptions)
  }

  sendEmail (email) {
    const transporter = nodemailer.createTransport(this.smtpConfig)
    return transporter.sendMail(email)
            .then(() => {
              return { message: 'Message sent' }
            })
        /* .catch((err) => {
            return new Error('Error creating message: ' + err)
        }); */
  }

  routeAPI () {
    const router = new Router()
    router.post('/email', (req, res) => {
      this
                .sendEmail(req.body)
                .then(ok(res))
                .then(null, fail(res))
    })

    router.post('/sms', (req, res) => {
      this
                .sendSMS(req.body)
                .then(ok(res))
                .then(null, fail(res))
    })

    return router
  }
}
