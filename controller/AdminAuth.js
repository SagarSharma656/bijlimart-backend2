const validator = require('validator');
const Admin = require('../model/adminModel');
const OTP = require('../model/otpModel');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');


const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            })
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "This is not a valid email Id"
            })
        }

        const existAdmin = await Admin.findOne({email: email});

        if(!existAdmin){
            return res.status(401).json({
                success: false,
                message: "Account not registerd"
            })
        }


        if(! await bcrypt.compare(password, existAdmin.password)){
            return res.status(403).json({
                success: false,
                message: "Password not match"
            })
        }

        existAdmin.password = null;

        const payload = {
            id: existAdmin._id,
            email: existAdmin.email,
            accountType: existAdmin.accountType,
        }

        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        })

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token: token,
            admin: existAdmin,
        })


    } catch (error) {
        console.log('Something went wrong in admin login : ', error);

        return res.status(500).json({
            success: false,
            message: `Something went wrong in admin login : ${error}`,
            error: error.message,
        });
    }
}

const adminSignUp = async (req, res) => {
    try {
        const {name, email, password, confirmPassword, otp} = req.body

        if(!name ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp){
                return res.status(400).json({
                    success: false,
                    message: "Fill all the mandatory fields"
                })
            }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "This is not a valid email Id"
            })
        }

        const adminExist = await Admin.findOne({email: email});

        if(adminExist){
            return res.status(400).json({
                success: false,
                message: "This Admin already exist"
            })
        }

        if(password != confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password not match"                
            })
        }

        const existOtp = await OTP.findOne({email: email});

        if(!existOtp || existOtp.otp != otp){
            return res.status().json({
                success: false,
                message: "OTP match not"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name: name,
            email: email,
            password : hashPassword,
        });

        admin.password = null;

        return res.status(200).json({
            success: true,
            message: "Admin create successfully",
            admin: admin
        })

    } catch (error) {
        console.log('Something went wrong when admin create : ', error);

        return res.status(500).json({
            success: false,
            message: `Admin not create : ${error}`,
            error: error.message,
        });
    }
}

module.exports = {adminSignUp, adminLogin}