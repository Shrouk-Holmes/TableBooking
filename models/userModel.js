const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String ,
        required: true
    },
    lastName: {
        type: String,
        required: true  
    },
    email:{
        type: String,
        required: true  ,
        unique: true,
        validate:[validator.isEmail,'filed must be a valid email address']
    
    
    }, password: {
        type: String,
        required: true
    },
    token :{
        type: String
    },
    role:{
        type: String,
        enum: [userRoles.ADMIN, userRoles.USER],
        default: userRoles.USER
    }
    })

    module.exports = mongoose.model('User', userSchema)