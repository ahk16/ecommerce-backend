const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //validate the format of the email - custom validation
        validate: {
            validator: function(value){
                return validator.isEmail(value);
            },
            message: function(){
                return 'Invalid Email Format'
            }
        },
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10,
        trim: true,
        validate: {
            validator: function(value){
                return validator.isNumeric(value);
            },
            message: function() {
                return 'Invalid Mobile Number Format'
            }
        } 
    },
    tokens: [{
        token: {
            type: String
        }
    }]
});

//to define our own instance methods
userSchema.methods.generateToken = function() {
    let user = this;
    let tokenData = {
        userId: this._id
    }
    let jwtToken = jwt.sign(tokenData, 'supersecret')
    user.tokens.push({ token: jwtToken });

    return user.save().then(function(user) {
        return jwtToken;
    })
}

//npm install --save bcryptjs
userSchema.pre('save', function(next) {
    let user = this;
    if(user.isNew) {
        bcryptjs.genSalt(10).then(function(salt) {
            bcryptjs.hash(user.password,  salt).then(function(encrypted) {
                user.password = encrypted;
                next();
            })
        }).catch(function(err) {
            console.log(err);
        })
    } else {
        next();
    }
    
});

userSchema.statics.findByCredentials = function(email, password) {
    //console.log(email, password);
    let User = this; 
    return User.findOne({ email: email }).then(function(user) {
        if(!user) {
            return Promise.reject('Invalid Email or Password!');
        }

        return bcryptjs.compare(password, user.password).then(function(res) {
            if(res) {
                return Promise.resolve(user)
            } else {
                return Promise.reject('Invalid Email or Password!')
            }
        })
    }) 
}

userSchema.statics.findByToken = function(token) {
    let User = this;
    let tokenData;

    try{
        tokenData = jwt.verify(token, 'supersecret');
    } catch(err) {
        return Promise.reject(err.message);
    }

    return User.findOne({
        '_id': tokenData.userId,
        'tokens.token': token //tokens is array, token is the field in that particular array
    })
}

//pre validate - function()
//actual validation
//post validate - function()
//pre save - function()
//actual save
//post save - function()




const User = mongoose.model('User', userSchema);

module.exports = {
    User
};