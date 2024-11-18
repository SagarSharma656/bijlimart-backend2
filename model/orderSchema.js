const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    warehouseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'warehouse',
    },
    products:{

    }
    
});

module.exports = orderSchema 