const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    price: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    image: [String],
    isAvilable :{
        type: Boolean,
        default: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
})


module.exports = mongoose.model('Product', productSchema);