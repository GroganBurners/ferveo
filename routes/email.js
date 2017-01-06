var nodemailer = require('nodemailer')

module.exports = function (app) {
  app.post('/email', function (req, res, next) {
        // send an email

    var smtpConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    }

    var transporter = nodemailer.createTransport(smtpConfig)

    var mailOptions = {
      from: '"Grogan Burner Services 👥" <' + process.env.MAIL_USER + '>', // sender address
      to: req.body.to, // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.text, // plaintext body
      html: req.body.html // html body
    }

        // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(404)
        res.json({ message: 'Error creating message', error: error })
        return
      }
      res.json({ message: 'Message sent', info: info.response })
    })
  })
}
