const DeliveryBoy = require('../model/deliveryBoyModel');
const validator = require('validator');
const OTP = require('../model/otpModel');
const bcrypt = require('bcryptjs');
const {fileUploadToCloudinary} = require('../utils/cloudinaryOperatios');
const otpGenerator = require('otp-generator');
const JWT = require('jsonwebtoken');
require('dotenv').config();



const login = async (req, res) => {
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

        const deliveryBoyExist = await DeliveryBoy.findOne({ email: email }).populate('assignedOrders');

        if(!deliveryBoyExist){
            return res.status(401).json({
                success: false,
                message: "User not registerd with us"
            });
        }

        if(!await bcrypt.compare(password, deliveryBoyExist.password)){
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            })
        }

        deliveryBoyExist.password = null;

        const payload = {
            id : deliveryBoyExist._id,
            email : deliveryBoyExist.email,
            accountType: deliveryBoyExist.accountType
        }

        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn : '24h'
        });

        const options = {
            path: '/',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
        };


        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Delivery boy login succesful",
            token,
            user: deliveryBoyExist
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

        const deliveryBoyExist = await DeliveryBoy.findOne({ email : email })

        if (deliveryBoyExist) {
            return res.status(400).json({
                success: false,
                message: "Delivery boy already registerd with us"
            })
        }

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

const addDeliveryBoy = async (req, res) => {
    try {
        const { name, phone, email, password, confirmPassword, vehicleType, vehicleNumber, licenseNumber, address, otp } = req.body;

        const { drivingLicenseImg, identityCardImg } = req.files

        if (!name ||
            !phone ||
            !email ||
            !password ||
            !confirmPassword ||
            !vehicleType ||
            !vehicleNumber ||
            !licenseNumber ||
            !address ||
            !otp ||
            !drivingLicenseImg ||
            !identityCardImg) {

            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "This not a valid email Id"
            })
        }

        const userExist = await DeliveryBoy.findOne({ email: email });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "Delivery boy already registered"
            })
        }

        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password not match"
            })
        }

        const existOtp = await OTP.findOne({ email: email }).sort({ createdAt: -1 });

        if(!existOtp || existOtp.otp != otp){
            return res.status(401).json({
                success: false,
                message: "Wrong OTP"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const DLImg = await fileUploadToCloudinary(drivingLicenseImg, process.env.CLOUD_FOLDER_DELIVERYBOY);
        const identityImg = await fileUploadToCloudinary(identityCardImg, process.env.CLOUD_FOLDER_DELIVERYBOY);


        const newDeliveryBoy = await DeliveryBoy.create({
            name,
            phone,
            email,
            password: hashPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}` ,
            vehicleDetails: { 
                vehicleType,
                vehicleNumber,
                licenseNumber,
            },
            drivingLicenceImg : DLImg.secure_url,
            identityCardImg : identityImg.secure_url,
            address,
        });


        return res.status(200).json({
            success: true,
            message: "New delivery boy created succesfully",
            deliveryBoy: newDeliveryBoy,
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

const changeBasicDetailsOfDeliveryBoy = async (req, res) => {
    try {
        const { deliveryBoyId, name } = req.body;

        if(!deliveryBoyId || !name){
            return res.status(400).json({
                success: false,
                message: 'Fill all the mandatory fields'
            });
        }

        const updatedDeliveryBoy = await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {name: name}, {new: true});


        return res.status(200).json({
            success: true,
            message: 'Basic details updated',
            deliveryBoy: updatedDeliveryBoy,
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

const blockAndUnblockDeliveryBoy = async (req, res) => {
    try {
        const {deliveryBoyId, isBlock} = req.body;


        if(!deliveryBoyId || isBlock === undefined){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            })
        }

        const updatedDeliveryBoy = await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {isBlock : isBlock}, {new: true});
        
        
        return res.status(200).json({
            suucess: true,
            message: `Delivery boy account ${isBlock? "Block" : "UnBlock"} succesfully`,
            deliveryBoy : updatedDeliveryBoy,          
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error.message,
        })
    }
}

const changeAvailableStatusOfDeliveryBoy = async (req, res) => {
    try {
        const {deliveryBoyId, isActive} = req.body;
        
        if(!deliveryBoyId || isActive === undefined){
            return res.status(400).json({
                success: false,
                message: 'Fill all the mandatory fields'
            })
        }

        const updatedDeliveryBoy = await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {isActive : isActive}, {new: true});

        return res.status(200).json({
            success: true,
            message: "Active status changed of delivery boy",
            deliveryBoy: updatedDeliveryBoy,
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error.message,
        })
    }
}

module.exports = {login, sendOtpOnEmail, addDeliveryBoy, changeBasicDetailsOfDeliveryBoy, blockAndUnblockDeliveryBoy, changeAvailableStatusOfDeliveryBoy}