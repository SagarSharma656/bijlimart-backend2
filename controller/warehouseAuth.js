const Warehouse = require('../model/warehouseModel');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
require('dotenv').config();
const validator = require('validator');
const otpGenerator = require('otp-generator');
const OTP = require('../model/otpModel');
const mailSender = require('../utils/mailSender');
const uuid = require('uuid').v4;


const warehouseLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
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

        const userExist = await Warehouse.findOne({ownerEmail : email});

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
        console.log('Something went wrong in warehouse login : ', error);

        return res.status(500).json({
            success: false,
            message: `Something went wrong in warehouse login : ${error}`,
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

        const warehouseExist = await Warehouse.findOne({ ownerEmail : email})

        if (warehouseExist){
            return res.status(400).json({
                success: false,
                message: "warehouse already registerd with us"
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


const createWarehouse = async (req, res) => {
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

        const userExist = await Warehouse.findOne({ ownerEmail: ownerEmail })

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

        const warehouse = await Warehouse.create({
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

        warehouse.password = null;

        return res.status(200).json({
            success: true,
            message: "warehouse create succesfully",
            warehouse: warehouse
        });
    } catch (error) {
        console.log('Something went wrong when warehouse craete : ', error);

        return res.status(500).json({
            success: false,
            message: `warehouse not create : ${error}`,
            error: error.message,
        });
    }
}

const getAllWarehouse = async (req, res) => {
    try {
        const allWarehouses = await Warehouse.find();


        return res.status(200).json({
            success: true,
            message: "All warehouse list",
            warehouseList : allWarehouses
        })
    } catch (error) {
        console.log('Something went wrong when fetch all warehouses : ', error);

        return res.status(500).json({
            success: false,
            message: `Something went wrong when fetch all warehouses : ${error}`,
            error: error.message,
        });
    }
}

const deleteWarehouse  = async (req, res) => {
    try {
        const {warehouseId} = req.body;

        if(!warehouseId){
            return res.status(400).json({
                success: false,
                message: "Please fill warehouseId"
            })
        }

        // delete warehouse product
        // delete product reviews
        // and other things if want

        await Warehouse.findByIdAndDelete(warehouseId);


        return res.status(200).json({
            success: true,
            message: "warehouse delete successfully"
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error ${error.message}`
        });
    }
}

const resetPasswordToken = async (req, res) => {
    try {
        const {email} = req.body;

        // console.log(email)

        if(!email){
            return res.status(400).json({
                success: true,
                message: "Fill all the mandatory fields"
            })
        }

        const userExist = await Warehouse.find({ ownerEmail : email })

        if(!userExist){
            return res.status(401).json({
                success: false,
                message: "This user is not registered with us."
            })
        }

        // console.log(userExist)

        const passResetToken = uuid();

        const url = `http://localhost:3000/updatePassword/${passResetToken}`;

        // console.log(passResetToken)

        const updatedWarehouse = await Warehouse.findOneAndUpdate({ownerEmail : email}, {
                                                                            passResetToken: `${passResetToken}`,
                                                                            resetPasswordExpires: Date.now() + 3600000
        }, { new: true }).populate('productList').populate('orders');


        updatedWarehouse.password = null;

        await mailSender(email, "Password reset email from BijliMart", `Password reast url (valid only for 5 min.): ${url}`)

        return res.status(200).json({
            success: true,
            message: "Email send succesfully",
            user: updatedWarehouse,
        })
        

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error,
        })
    }
}


const resetPassword = async (req, res) => {
    try {
        const {token, password, confirmPassword} = req.body;

        if(!token || !password || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Please fill all the mandatory fields"
            });
        }

        if(password != confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password not match",
            })
        }

        const existUser = await Warehouse.findOne({ passResetToken : token});

        // console.log(existUser);

        if(!existUser){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        if(existUser.resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success: false,
                message: "Token expire"
            })
        }


        const hashPassword = await bcrypt.hash(password, 10);

        // console.log(hashPassword);


        const updatedWarehouse = await Warehouse.findByIdAndUpdate(
                                                                existUser._id,
                                                                {password: hashPassword},
                                                                {new: true}
        ).populate('productList').populate('orders');

        // await mailSender(    
        //     existUser.ownerEmail,
        //     "Password Reset Succesful",
        //     `Your password on this ${existUser.ownerEmail} account succesfully reset if its not you then contact us`
        // );

        return res.status(200).json({
            success: true,
            user: updatedWarehouse,
            message: "Password Reset succesful"
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error
        })
    }
}

module.exports = {warehouseLogin, sendOtpOnEmail ,createWarehouse, getAllWarehouse, deleteWarehouse, resetPasswordToken, resetPassword}