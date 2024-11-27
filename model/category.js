const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", 
        }
    ],
    subCategory : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Category', categorySchema);