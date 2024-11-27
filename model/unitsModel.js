const mongoose = require('mongoose');

const unitsSchema = new mongoose.Schema({
    unitName : {
        type : String,
        required: true,
    },
    description: {
        type: String,
    },
    products : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Product"
        }
    ],
    createdAt : {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Unit', unitsSchema);