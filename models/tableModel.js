const mongoose = require('mongoose');
const tableSchema = new mongoose.Schema({
name:{
    type: String,
    required: true
},
phone :{
    type: Number,
    required: true
},
date:{
    type:Date,
    required: true
},
time :{
    type: String,
    required: true,
},
totalPerson:{
    type: Number,
    required: true,
    min: 1
}
,status:{
    type: String,
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
}

})

module.exports = mongoose.model('Table', tableSchema)