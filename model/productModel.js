const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    subCategory : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory"
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Unit'
    },
    price: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    images: [
        {
            type: String
        }
    ],
    isAvailable :{
        type: Boolean,
        default: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})


module.exports = mongoose.model('Product', productSchema);