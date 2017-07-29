var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var nodemailer = require('nodemailer');

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
     User.find({}, function(err, users){
      if(err){
        next(err);
      }
      res.json(users);
  });
});

router.post('/passwordchange', function (req, res, next) {
    User.findByUsername(req.body.username).then(function (user)
    {
        if (user)
        {
            user.setPassword(req.body.password1, function (err)
            {
                if (err) return next(err);
                user.save(function (err) {
                    console.log(err);
                    if (err) return next(err);
                    res.status(200).json({ status: 'password change Successful!' });
                });
            });
        } 
    }, function(err) {
        next(err);
    });
});

router.post('/passwordreset', function (req, res, next) {
    User.findOne({ emailid: req.body.emailid }, function (err, user) {
        if (user) {
            user.setPassword(req.body.password1, function (err) {
                if (err) return next(err);
                user.save(function (err) {
                    console.log(err);
                    if (err) return next(err);
                    res.status(200).json({ status: 'password reset Successful!' });
                });
            });
        }
    });
});

router.post('/register', function (req, res, next) {

    User.register(new User({ username: req.body.username }),
      req.body.password, function(err, user) {
          if (err) {
                return res.status(500).json({err: err});
        }
        if (req.body.emailid) {
            user.emailid = req.body.emailid;
        }
        if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        user.save(function (err, user) {
            console.log(err);
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({ status: 'Registration Successful!' });
            });
        });
    });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
            return next(err);
    }
    if (!user) {
            return res.status(401).json({
                err: info
            });
    }
    req.logIn(user, function(err) {
            if (err) {
                    return res.status(500).json({
                    err: 'Could not log in user'
                    });
            }
        
            var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
        
            res.status(200).json({
                    status: 'Login successful!',
                    success: true,
                    token: token
            });
    });
  })(req,res,next);
});

router.post('/logout', function (req, res) {
    req.logOut();
    res.send(200);
});

router.post('/mailer', function (req, res, next) {
        User.findOne({ emailid: req.body.emailid }, function (err, user) {
            if (user) {
                next(new Error('Duplicate emailid'));
            } else {
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'successarchitecture@gmail.com',
                        pass: 'bimwwbmxxyfhmtwe'
                    }
                });
                var mailOptions = {
                    from: 'successarchitecture@gmail.com',
                    to: req.body.emailid,
                    subject: 'Your Registration Code is: ' + req.body.generatedRegistrationCode,
                    text: 'Your Registration Code is: ' + req.body.generatedRegistrationCode + req.body.username + 'email ' + req.body.emailid,
                    html: '<p>Your Registration Code is: </p>' + req.body.generatedRegistrationCode + '<ul><li>username ' + req.body.username + '</li><li>email ' + req.body.emailid + '</li><li>Code: ' + req.body.generatedRegistrationCode + '</li></ul>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        next(err);
                    } else {
                        console.log('reg email sent');
                        res.status(200).json({
                            status: 'Registration Code Message Sent' + info.response,
                            success: true
                        });
                    }
                });
            };
        });
});

router.post('/passwordcodemailer', function (req, res, next) {
    User.findOne({ emailid: req.body.emailid }, function (err, user) {
        if (!user) {
            next(new Error('Emailid Does Not Exist!'));
        } else {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'successarchitecture@gmail.com',
                    pass: 'bimwwbmxxyfhmtwe'
                }
            });
            var mailOptions = {
                from: 'successarchitecture@gmail.com',
                to: req.body.emailid,
                subject: 'Your Forget Password Code is: ' + req.body.generatedPasswordCode,
                text: 'Your Forget Password Code is: ' + req.body.generatedPasswordCode + req.body.username + 'email ' + req.body.emailid,
                html: '<p>Your Forget Password Code is: </p>' + req.body.generatedPasswordCode + '<ul><li>email ' + req.body.emailid + '</li></ul>'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    next(err);
                } else {
                    console.log('password forget code email sent');
                    res.status(200).json({
                        status: 'password forget Code Message Sent' + info.response,
                        success: true
                    });
                }
            });
        };
    });
});

module.exports = router;
