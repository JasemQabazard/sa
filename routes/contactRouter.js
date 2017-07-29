var express = require('express');
var contactRouter = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
contactRouter.get('/', function (req, res, next) {
    res.render('contact', { title: 'Contact' });
});

/* send contact support email. */
contactRouter.post('/', function (req, res, next) {
    // I was testing error handling return next(new Error('texting error handling'));
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'successarchitecture@gmail.com',
            pass: 'bimwwbmxxyfhmtwe'
        }
    });
    var mailOptions = {
        from: req.body.emailid,
        to: 'successarchitecture@gmail.com',
        subject: 'A Support Mesage From: ' + req.body.firstname + ' ' + req.body.lastname,
        text: 'View email in HTML',
        html: '<p>The contact support message states: </p><ul><li>phone ' + req.body.phone.countrycode + req.body.phone.telnum + '</li><li>priority ' + req.body.priority + '</li><li>subject: ' + req.body.subject + '</li><li>message: ' + req.body.message + '</li><li>email: ' + req.body.emailid + '</li></ul>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            next(err);
        } else {
            res.status(200).json({
                status: 'Registration Code Message Sent' + info.response,
                success: true
            });
        }
    });
});

module.exports = contactRouter;