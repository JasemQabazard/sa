var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 86400 // 1 day while 3600 is one hour
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

// Admin user
exports.verifyAdmin = function (req, res, next) {
    // check header or url parameters or post parameters for token
    if (!req.decoded) {
        var err = new Error('You are not An ADMINISTRATOR!');
        err.status = 401;
        return next(err);
    } else {
        var id = req.decoded._id;
        if (req.decoded.admin) {
            next();
            } else {
                var err = new Error('You are not An ADMINISTRATOR!');
                err.status = 401;
                return next(err);
            }
        }
};