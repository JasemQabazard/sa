var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: { type: String},
    password: String,
    emailid: { type: String, unique: true, trim:true },
    OauthId: {type: String,default: ''},
    OauthToken: {type: String,default: ''},
    firstname: { type: String, default: '', trim: true },
    lastname: { type: String, default: '', trim: true },
    birthdate: { type: Date, default: Date.now },
    profileimage: { type: String, default: '', trim: true },
    profilesummary: { type: String, default: '', trim: true },
    admin:   {type: Boolean,default: false}
}, {timestamps: true});
//
// an instance added to the schema for the full name
//
User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);