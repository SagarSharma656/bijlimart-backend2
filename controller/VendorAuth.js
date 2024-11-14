const Vendor = require('../model/vendorModel');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
require('dotenv').config();
const validator = require('validator');
const otpGenerator = require('otp-generator');
const OTP = require('../model/otpModel');


const vendorLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email, !password){
            res.status(400).json({
                success: false,
                message: "Fill all the mandatory field",
            });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "This not a valid email Id"
            })
        }

        const userExist = await Vendor.findOne({ownerEmail : email});

        // console.log(userExist)

        if(!userExist){
            return res.status(401).json({
                success: false,
                message: "User not registerd please SignUp first"
            })
        }

        // console.log(password)
        // console.log(userExist)

        if(! await bcrypt.compare(password, userExist.password)){
            return res.status(401).json({
                success: false,
                message: "Password not matched"
            });
        }

        userExist.password = null;

        const payload = {
            id: userExist._id,
            email: userExist.email,
            accountType: userExist.accountType
        }

        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });


        return res.status(200).json({
            success: true,
            message: "Login succesful",
            token: token,
            user: userExist,
        })
        
    } catch (error) {
        console.log('Something went wrong in vendor login : ', error);

        return res.status(500).json({
            success: false,
            message: `Something went wrong in vendor login : ${error}`,
            error: error.message, 
        });
    }
}

const sendOtpOnEmail = async (req, res) => {
    try {

        const {email} = req.body;

        // console.log(email)

        if(!email){
            return res.status(400).json({
                success: false,
                message: 'Fill all the required fields'
            });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "This is not a valid email Id"
            })
        }

        const vandorExist = await Vendor.findOne({ ownerEmail : email})

        if(vandorExist){
            return res.status(400).json({
                success: false,
                message: "Vendor already registerd with us"
            })
        }

        const otp = await otpGenerator.generate(6,{
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


const createVendor = async (req, res) => {
    try {
        const { ownerName, ownerEmail, shopName, shopAddress, password, confirmPassword, otp } = req.body;

        if (!ownerName ||
            !ownerEmail ||
            !shopName ||
            !shopAddress.street ||
            !shopAddress.city ||
            !shopAddress.state ||
            !shopAddress.pinCode ||
            !password ||
            !confirmPassword ||
            !otp) {

            return res.status(400).json({
                success: false,
                message: "Fill all the madatory fields"
            });
        }

        if (!validator.isEmail(ownerEmail)) {
            return res.status(400).json({
                success: false,
                message: 'This not a valid email Id'
            });
        }

        const userExist = await Vendor.findOne({ ownerEmail: ownerEmail })

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }

        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password not match'
            })
        }

        const existOtp = await OTP.findOne({ email: ownerEmail }).sort({ createdAt: -1 });

        if (!existOtp || existOtp.otp != otp) {
            return res.status(400).json({
                success: false,
                message: 'OPT not match'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const vendor = await Vendor.create({
            ownerName: ownerName,
            ownerEmail: ownerEmail,
            password: hashPassword,
            shopName: shopName,
            shopAddress: {
                street: shopAddress?.street,
                city: shopAddress?.city,
                state: shopAddress?.state,
                pinCode: shopAddress?.pinCode,
            },
        });

        vendor.password = null;

        return res.status(200).json({
            success: true,
            message: "Vendor create succesfully",
            vendor: vendor
        });
    } catch (error) {
        console.log('Something went wrong when vendor craete : ', error);

        return res.status(500).json({
            success: false,
            message: `Vendor not create : ${error}`,
            error: error.message,
        });
    }
}

const getAllVendor = async (req, res) => {
    try {
        const allVendors = await Vendor.find();


        return res.status(200).json({
            success: true,
            message: "All vendor list",
            vendorList : allVendors
        })
    } catch (error) {
        console.log('Something went wrong when fetch all vendors : ', error);

        return res.status(500).json({
            success: false,
            message: `Something went wrong when fetch all vendors : ${error}`,
            error: error.message,
        });
    }
}

const deleteVendor  = async (req, res) => {
    try {
        const {vendorId} = req.body;

        if(!vendorId){
            return res.status(400).json({
                success: false,
                message: "Please fill vendorId"
            })
        }

        // delete vendor product
        // delete product reviews
        // and other things if want

        await Vendor.findByIdAndDelete(vendorId);


        return res.status(200).json({
            success: true,
            message: "Vendor delete successfully"
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error ${error.message}`
        });
    }
}

module.exports = {vendorLogin, sendOtpOnEmail ,createVendor, getAllVendor, deleteVendor}