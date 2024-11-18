const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    ownerName:{
        type: String
    },
    ownerEmail:{
        type: String
    },
    password: {
        type: String,
    },
    shopName:{
        type: String
    },
    shopAddress: {
        street: String,
        city: String,
        state: String,
        pinCode: String,
    },
    isBlocked: { 
        type: Boolean, 
        default: false 
    },
    accountType : {
        type: String,
        default: "warehouse"
    },
    productList: [
        {
            productId: mongoose.Schema.Types.ObjectId,
        }
    ],
    orders : [
        {
            orderId: mongoose.Schema.Types.ObjectId,
        }
    ],
    passResetToken:{
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    createdAt : {
        type: Date,
        default: Date.now(),
    }

});

module.exports = mongoose.model('Warehouse', warehouseSchema);