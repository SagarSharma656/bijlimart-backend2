const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    password: {
        type: String
    },
    address:{
        street: String,
        city: String,
        state: String,
        zip: String,
    },
    phone: {
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("User", UserSchema)