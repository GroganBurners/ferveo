const nodemailer = require('nodemailer')
const Router = require('express')

module.exports = class EmailController {
    constructor() {
        const smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }

        this.transporter = nodemailer.createTransport(smtpConfig)
    }

    sendTestEmail(body) {
        const mailOptions = {
            from: '"Grogan Burner Services 👥" <' + process.env.MAIL_USER + '>', // sender address
            to: body.to, // list of receivers
            subject: body.subject, // Subject line
            text: body.text, // plaintext body
            html: body.html // html body
        }
        this.send(mailOptions)
    }

    send(email) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return new Error('Error creating message: ' + error)
            }
            return { message: 'Message sent', info: info.response }
        })
    }

    route() {
        const router = new Router()
        router.post('/', (req, res) => {
            this
                .sendTestEmail(req.body)
                .then(ok(res))
                .then(null, fail(res))
        })


        return router
    }
}