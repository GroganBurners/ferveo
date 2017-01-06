const nodemailer = require('nodemailer')
const Router = require('express')
var rp = require('request-promise')
var ok = require('./utils').ok
var fail = require('./utils').fail

module.exports = class MessageController {
    constructor() {
        this.smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }
    }

    sendSMS(sms) {
        var data = {
            'username': process.env.SMS_USER,
            'password': process.env.SMS_PASS,
            'function': 'sendSms',
            'number': sms.number,
            'message': sms.message,
            'senderid': 'GrogBurners'
        }

        return rp('https://www.my-cool-sms.com/api-socket.php', { json: true, body: data })
            .then((resp) => {
                if (resp.hasOwnProperty("errorcode")) {
                    console.log('Send SMS failed: ' + resp.description)
                    throw new Error('SMS Send failed!')
                } else {
                    return { message: 'Message sent' }
                }
            })
        /*.catch((err) => {
            return new Error('Error creating message: ' + err)
        });*/
    }

    sendTestEmail(body) {
        const mailOptions = {
            from: '"Grogan Burner Services 👥" <' + process.env.MAIL_USER + '>', // sender address
            to: body.to, // list of receivers
            subject: body.subject, // Subject line
            text: body.text, // plaintext body
            html: body.html // html body
        }
        return this.send(mailOptions)
    }

    sendEmail(email) {
        const transporter = nodemailer.createTransport(this.smtpConfig)
        return transporter.sendMail(email)
            .then(() => {
                return { message: 'Message sent' }
            })
        /*.catch((err) => {
            return new Error('Error creating message: ' + err)
        });*/
    }

    route() {
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
