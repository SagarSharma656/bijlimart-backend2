    const mongoose = require('mongoose');

    const warehouseSchema = new mongoose.Schema({
        ownerName:{
            type: String
        },
        ownerEmail:{
            type: String
        },
        password: {
            type: String,
        },
        image: {
            type: String,
        },
        warehouseName:{
            type: String
        },
        warehouseAddress: {
            street: String,
            city: String,
            state: String,
            pinCode: String,
        },
        warehouseImage : {
            type: [String]
        },
        aadharImage: {
            type: String, // URL or path to the uploaded Aadhaar image
        },
        panImage: {
            type: String, // URL or path to the uploaded PAN image
        },
        passbookImage: {
            type: String, // URL or path to the uploaded passbook image
        },
        bankDetails: {
            accountHolderName: { type: String }, // Bank account holder's name
            accountNumber: { type: String }, // Bank account number
            ifscCode: { type: String }, // Bank IFSC code
            bankName: { type: String }, // Name of the bank
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        },
        isBlocked: { 
            type: Boolean, 
            default: false 
        },
        accountType : {
            type: String,
            default: "warehouse"
        },
        productList: [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product"
            }
        ],
        orders : [
            {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Order"
            } 
            
        ],
        passResetToken:{
            type: String,
        },
        rebsetPasswordExpires: {
            type: Date,
        },
        createdAt : {
            type: Date,
            default: Date.now,
        }

    });

    warehouseSchema.index({ location: '2dsphere' });

    module.exports = mongoose.model('Warehouse', warehouseSchema);