const nodemailer = require('nodemailer')
var rp = require('request-promise')
const Router = require('express')
var ok = require('./utils').ok
var fail = require('./utils').fail

module.exports = class SmsController {

    send(sms) {
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
                    if(resp.hasOwnProperty("errorcode")){
                        console.log('Send SMS failed: ' + resp.description)
                        throw new Error('SMS Send failed!');
                    }else{
                        return { message: 'Message sent' }
                    }
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