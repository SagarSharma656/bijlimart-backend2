const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    vendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    products:{

    }
    
});

module.exports = orderSchema 