const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    profileImg: {
        type: String,
    },
    currentLocation: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    // addresses: [
    //     {
    //         label: { type: String, enum : ["Home", "Work", "Hotel", "Other"], defalut: "Home" }, // e.g., Home, Office
    //         address: { type: String, required: true },
    //         location: {
    //             type: { type: String, enum: ["Point"], default: "Point" },
    //             coordinates: { type: [Number], required: true }, // [longitude, latitude]
    //         },
    //     },
    // ],
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address", // Reference to Address schema
        },
    ],
    accountType: {
        type: String,
        default: "user"
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
            },
            addedAt: {
                type: Date,
                defalut: Date.now,
            }
        }
    ],

    // orders: [
    //     {
    //         orderId: {
    //             type: mongoose.Schema.Types.ObjectId, 
    //             ref: "Order"
    //         },
    //         orderDate: {
    //             type: Date,
    //             default: Date.now,
    //         }
    //     }
    // ],

    createdAt: {
        type: Date,
        default: Date.now,
    }

});


UserSchema.index({ "currentLocation.coordinates": "2dsphere" });
UserSchema.index({ "addresses.location.coordinates": "2dsphere" });

module.exports = mongoose.model("User", UserSchema)