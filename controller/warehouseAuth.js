const Warehouse = require('../model/warehouseModel');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
require('dotenv').config();
const validator = require('validator');
const OTP = require('../model/otpModel');
const { mailSender, lowStockMailSend } = require('../utils/mailSender');
const uuid = require('uuid').v4;
const { fileUploadToCloudinary, getPublicIdFromUrl, deteteFromCloudinary } = require('../utils/cloudinaryOperatios');
const Product = require('../model/productModel');



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

        const options = {
            path: '/',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
        };


        return res.cookie("token", token, options).status(200).json({
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

const createWarehouse = async (req, res) => {
    try {
        const { 
            ownerName, 
            ownerEmail, 
            warehouseName, 
            warehouseAddress, 
            bankDetails,
            password, 
            confirmPassword, 
            longitude, 
            latitude, 
            otp } = req.body;

        const {
            image,
            warehouseImages,
            aadharImage,
            panImage,
            passbookImage,
        } = req.files

        if (!ownerName ||
            !ownerEmail ||
            !warehouseName ||
            !warehouseAddress.street ||
            !warehouseAddress.city ||
            !warehouseAddress.state ||
            !warehouseAddress.pinCode ||
            !bankDetails.accountHolderName ||
            !bankDetails.accountNumber ||
            !bankDetails.ifscCode ||
            !bankDetails.bankName ||
            !password ||
            !confirmPassword ||
            !longitude ||
            !latitude ||
            !otp) {

            return res.status(400).json({
                success: false,
                message: "Fill all the madatory fields"
            });
        }

        if (!image ||
            !warehouseImages ||
            !aadharImage ||
            !panImage ||
            !passbookImage){

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

        const userExist = await Warehouse.findOne({ ownerEmail: ownerEmail });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'This warehoue already registered'
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

        const profileImg = await fileUploadToCloudinary(image, process.env.CLOUD_FOLDER_WAREHOUSE_OWNER);

        const warehouseImagesUrl = [];
        if (Array.isArray(warehouseImages)) {
            for (const image of warehouseImages) {
                const uploadImage = await fileUploadToCloudinary(image, process.env.CLOUD_FOLDER_WAREHOUSE, 70)
                warehouseImagesUrl.push(uploadImage.secure_url);
            }
        }

        const aadharImg = await fileUploadToCloudinary(aadharImage, process.env.CLOUD_FOLDER_WAREHOUSE_OWNER);
        const panImg = await fileUploadToCloudinary(panImage, process.env.CLOUD_FOLDER_WAREHOUSE_OWNER);
        const passbookImg = await fileUploadToCloudinary(passbookImage, process.env.CLOUD_FOLDER_WAREHOUSE_OWNER);


        const warehouse = await Warehouse.create({
            ownerName: ownerName,
            ownerEmail: ownerEmail,
            password: hashPassword,
            image : profileImg.secure_url,
            warehouseName: warehouseName,
            warehouseAddress: {
                street: warehouseAddress?.street,
                city: warehouseAddress?.city,
                state: warehouseAddress?.state,
                pinCode: warehouseAddress?.pinCode,
            },
            warehouseImage: warehouseImagesUrl,
            aadharImage: aadharImg,
            panImage: panImg,
            passbookImage: passbookImg,
            bankDetails: {
                accountHolderName: bankDetails?.accountHolderName,
                accountNumber: bankDetails?.accountNumber,
                ifscCode: bankDetails?.ifscCode,
                bankName: bankDetails?.bankName,
            },
            location: {
                type: 'Point',
                coordinates: [longitude, latitude] // [longitude, latitude]
            }
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

        const warehouse = await Warehouse.findById(warehouseId);

        await deteteFromCloudinary(getPublicIdFromUrl(warehouse.image));

        if(Array.isArray(warehouse.warehouseImage)){
            warehouse.warehouseImage.forEach(image => deteteFromCloudinary(getPublicIdFromUrl(image)))
        }

        await deteteFromCloudinary(getPublicIdFromUrl(warehouse.aadharImage));
        await deteteFromCloudinary(getPublicIdFromUrl(warehouse.panImage));
        await deteteFromCloudinary(getPublicIdFromUrl(warehouse.passbookImage));


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
                                                                { password: hashPassword, passResetToken: ""},
                                                                {new: true}
        ).populate('productList').populate('orders');

        await mailSender(    
            existUser.ownerEmail,
            "Password Reset Succesful",
            `Your password on this ${existUser.ownerEmail} account succesfully reset if its not you then contact us`
        );

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

const findNearestWarehouse = async (req, res) => {
    try {
        const { userLongitude, userLatitude } = req.body;

        if (!userLongitude || !userLatitude ){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        const nearestWarehouse = await Warehouse.findOne({
            location:{
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates : [userLongitude, userLatitude]
                    },
                    $maxDistance: 5000,
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "Nearest warehouse fetched",
            warehouse: nearestWarehouse
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

const lowStockAlert = async (req, res) => {
    try {
        const { warehouseId, threshold } = req.body;

        if(!warehouseId || !threshold){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields",
            });
        }

        const warehouse = await Warehouse.findById(warehouseId);

        if(!warehouse){
            return res.status(401).json({
                success: false,
                message: "Warehouse not registered"
            });
        }

        const lowStockProduct = await Product.find({
            warehouseId,
            stock: { $lt: threshold },
        });

        if (lowStockProduct.length === 0){
            return res.status(200).json({
                success: false,
                message: 'No low stock Product'
            })
        }

        await lowStockMailSend(lowStockProduct);

        return res.status(200).json({
            suucess: true,
            message: "Send low stock alert successfully"
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

const updateStock = async (req, res) => {
    try {
        const {productId, newStock} = req.body

        if(!productId || !newStock){
            return res.status(400).json({
                success: false,
                message: 'Fill all the mandatory fields'
            })
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            stock : newStock,
        }, { new: true })
            .populate('category')
            .populate('subCategory')
            .populate('unitId')
            .exec();

        if(!updatedProduct){
            return res.status(400).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Stock updated succesfuly",
            updatedProduct
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

const markAvailableOrNot = async (req, res) => {
    try {
        
        const { productId, available } = req.body

        if(!productId){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            })
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            isAvailable: available,
        }, {new : true})
            .populate('category')
            .populate('subCategory')
            .populate('unitId')
            .exec();

        if (!updatedProduct) {
            return res.status(400).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Now Product is ${available ? "" : "not"} availabel`,
            updatedProduct
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message:  `Sever Error : ${error.message}`,
            error: error.message
        });
    }
}


module.exports = {
    warehouseLogin,
    createWarehouse,
    getAllWarehouse,
    deleteWarehouse,
    resetPasswordToken,
    resetPassword,
    findNearestWarehouse,
    lowStockAlert,
    updateStock,
    markAvailableOrNot,
}