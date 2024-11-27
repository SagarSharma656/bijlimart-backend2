const validator = require('validator');
const otpGenerator = require('otp-generator');
const OTP = require('../model/otpModel');
const whatAppMessage = require('../utils/whatsAppMessage');


const sendOtpOnEmail = async (req, res) => {
    try {

        const { email } = req.body;

        // console.log(email)

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Fill all the required fields'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "This is not a valid email Id"
            })
        }

        // const warehouseExist = await Warehouse.findOne({ ownerEmail: email })

        // if (warehouseExist) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "warehouse already registerd with us"
        //     })
        // }

        const otp = await otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        await OTP.create({
            email: email,
            otp: otp,
        });


        return res.status(200).json({
            success: true,
            message: "OTP send on your email",
            otp: otp
        })

    } catch (error) {
        console.log('Otp not send : ', error);

        return res.status(500).json({
            success: false,
            message: `Otp not send : ${error}`,
            error: error.message,
        });
    }
}

const sendOtpOnWhatsapp = async (req, res) => {
    try {
        const { phone } = req.body;

        const regex = /^[6-9]\d{9}$/;

        if (!regex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number"
            })
        }

        const otp = await otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        await OTP.create({
            phone: phone,
            otp: otp,
        });

        await whatAppMessage(phone, `This is your OTP : ${otp}`);

        

        return res.json({
            success: true,
            message: "OTP send on your whatsapp",
            otp : otp,
        });

      


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error.message
        })
    }
}

module.exports = { sendOtpOnEmail, sendOtpOnWhatsapp }