const mongoose = require('mongoose');


//user Schema
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    profilepix:{
        type: String,
        require: false
    }
});

const User = module.exports = mongoose.model('User', UserSchema);