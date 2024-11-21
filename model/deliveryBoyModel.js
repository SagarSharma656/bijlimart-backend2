const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/, // Matches a 10-digit phone number
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    vehicleDetails: {
        vehicleType: { 
            type: String,
            required: true 
        },
        vehicleNumber: { 
            type: String, 
            required: true, 
            unique: true 
        },
        licenseNumber: { 
            type: String, 
            required: true, 
            unique: true 
        },
    },
    drivingLicenceImg:{
        type: String,
    },
    identityCardImg:{
        type: String,
    },
    accountType: {
        type: String,
        default: "deliveryBoy"
    },
    address:{
        type: String
    },
    currentLocation: {
        type: {
            type: String, // GeoJSON type must be "Point"
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // Array of numbers [longitude, latitude]
            required: true,
        },
    },
    assignedOrders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    isBlock:{
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true, // Indicates if the delivery boy is currently available
    },
    status: {
        type: String,
        enum: ['Available', 'On Delivery', 'Unavailable'],
        default: 'Available',
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

// deliveryBoySchema.index({ currentLocation: '2dsphere' }); // Enables geospatial queries for currentLocation

const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema);

module.exports = DeliveryBoy;
