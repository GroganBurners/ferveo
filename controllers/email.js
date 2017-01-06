const nodemailer = require('nodemailer')
const Router = require('express')
var ok = require('./utils').ok
var fail = require('./utils').fail

module.exports = class EmailController {
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

    send(email) {
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
        router.post('/', (req, res) => {
            this
                .send(req.body)
                .then(ok(res))
                .then(null, fail(res))
        })


        return router
    }
}