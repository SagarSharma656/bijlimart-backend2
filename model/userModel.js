const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    profileImg: {
        type: String,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
    },
    phone: {
        type: String,
    },
    accountType: {
        type: String,
        default: "user"
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Cart',
            },
            quantity: {
                type: Number,
                default: 1,
            },
            addedAt: {
                type: Date,
                defalut: Date.now(),
            }
        }
    ],

    orders: [
        {
            orderId: {
                type: mongoose.Schema.Types.Order, 
            },
            orderDate: {
                type: Date,
                default: Date.now(),
            } 
        }
    ],

    createdAt:{
        type: Date,
        default: Date.now(),
    }

});

module.exports = mongoose.model("User", UserSchema)