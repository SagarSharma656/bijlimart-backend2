const mongoose = require('mongoose');
const { eventNames } = require('./warehouseModel');

const adminSchema = new mongoose.Schema({
 
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: "admin"
    }
})

module.exports = mongoose.model('Admin', adminSchema);