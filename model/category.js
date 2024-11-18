const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    product : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", 
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Category', categorySchema);