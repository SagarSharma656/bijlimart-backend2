const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    phone: {
        type: String
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60
    }
});

otpSchema.pre("save", async function (next) {

    if (this.isNew) {
        if (this.email) {
            const emailResponse = await mailSender(
                this.email,
                'This is email verification email',
                `OTP for email verification- ${this.otp}`
            );
            // console.log('Email response : ', emailResponse?.response);                                
        }
    }
    next();
})


module.exports = mongoose.model("OTP", otpSchema);