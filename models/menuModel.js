const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({
title:{
    type: String,
    required: true
},
price :{
    type: Number,
    required: true
}

})

module.exports = mongoose.model('Menu', menuSchema)