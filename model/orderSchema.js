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
    products:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
    
});


module.exports = mongoose.model("Order", orderSchema);