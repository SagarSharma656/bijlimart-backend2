const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // Link to the user
    },
    name: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        enum: ["Home", "Work", "Hotel", "Other"],
        default: "Home"
    }, // e.g., Home, Office
    address: {
        type: String,
        required: true
    }, // Full address as a string
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Add geospatial index for location
AddressSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Address", AddressSchema);
