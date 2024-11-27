const User = require('../model/userModel');
const OTP = require('../model/otpModel');
const JWT = require('jsonwebtoken');
require('dotenv').config();
const Address = require('../model/addresses');


const userLoginSignUp = async (req, res) => {
    try {
        const {phone, otp} = req.body;

        if(!phone || !otp){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        // const userExist = await User.findOne({ phone: phone }).populate({
        //                                                                     path: "cart.productId",
        //                                                                     model: "Product"
        //                                                                 }).populate({
        //                                                                     path: "orders.orderId",
        //                                                                     model: "Order", 
        //                                                                 });
        const userExist = await User.findOne({ phone: phone }).populate({
                                                                            path: "cart.productId",
                                                                            model: "Product"
                                                                        });

        const existOtp = await OTP.findOne({phone : phone}).sort({createdAt : -1});


        if(!existOtp || existOtp.otp != otp){
            return res.status(401).json({
                success: false,
                message: "Wrong OTP"
            });
        }

        await OTP.deleteMany({ phone: phone });


        if(userExist){

            const payload = {
                id: userExist._id,
                phone: userExist.phone,
                accountType: userExist.accountType
            }

            const token = JWT.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });

            const options = {
                path: '/',
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: false,
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User login succesful",
                user: userExist,
                token,
            });

        }else{

            const newUser = await User.create({
                phone
            })

            const payload = {
                id: newUser._id,
                email: newUser.phone,
                accountType: newUser.accountType
            }

            const token = JWT.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });

            const options = {
                path: '/',
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: false,
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User registered succesfully",
                user: newUser,
                token
            });


        }


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error.message,
        })
    }
}


const addAddress = async (req, res) => {
    try {

        const { name, label, address, longitude, latitude } = req.body;
        const userId = req.user.id;

        if(!name ||
            !label ||
            !address ||
            !longitude ||
            !latitude){

                return res.status(400).json({
                    success: false,
                    message: "Fill all the mandatory fields"
                });
        }

        const newAddress = await Address.create({
            userId,
            name,
            label,
            address,
            location : {
                type: 'Point',
                coordinates : [longitude, latitude],
            },
        });

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $push:{
                addresses : newAddress._id,
            }
        },{new: true}).populate({
            path: "addresses",
        })


        return res.status(200).json({
            success: true,
            message: "Address add successfully",
            user: updatedUser
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

const updateAddress = async (req, res) => {
    try {
        const { addressId, name, label, address, longitude, latitude } = req.body;

        if (!addressId ||
            !label ||
            !address ||
            !longitude ||
            !latitude) {

            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        const updatedAddress = Address.findByIdAndUpdate(addressId, {
            name,
            label,
            address,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        });


        return res.status(200).json({
            success: true,
            message: "Address update succesful",
            address: updatedAddress,
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

const deleteAddress = async (req, res) => {
    try {
        const {addressId} = req.body;
        const userId = req.body.user

        if(!addressId){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $pull : {
                addresses : addressId   
            }
        }, {new : true}).populate({
            path: "addresses"
        });

        await Address.findByIdAndDelete(addressId);

        return res.status(200).json({
            success: true,
            message: "Address delete successfully",
            updatedUser,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error.message
        });
    }
}



module.exports = { userLoginSignUp, addAddress, updateAddress, deleteAddress }