let mongoose = require('mongoose');

//ARTICLES schema
let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    like:{
        type: Number,
        required: false
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);