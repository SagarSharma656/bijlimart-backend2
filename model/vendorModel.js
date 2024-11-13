const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
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
        default: "vendor"
    },
    productListing: [
        {
            productId: mongoose.Schema.Types.ObjectId,
        }
    ],
    orders : [
        {
            orderId: mongoose.Schema.Types.ObjectId,
        }
    ],
    createdAt : {
        type: Date,
        default: Date.now(),
    }

});

module.exports = mongoose.model('Vendor', vendorSchema);