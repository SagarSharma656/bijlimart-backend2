const mongoose  = require("mongoose");

const Product = require("../model/productModel");
const fileUploadToCloudinary = require("../utils/fileUploadToCloudinary");
require('dotenv').config();


const addProduct = async (req, res) => {
    try {
        const user = req.user;
        const {title, description, categoryId, price, weight, stock} = req.body;
        const {images} = req.files;



        if(!title ||
            !description ||
            !categoryId ||
            !price ||
            !weight ||
            !stock){
                return res.status(400).json({
                    success: false,
                    message : "Fill all the mandatory fields"
                });
            }

        if(!images || images.length == 0){
            return res.status(400).json({
                success: false,
                message: "Add atleast one image"
            })
        }

        // const vendorId = new mongoose.Types.ObjectId(user.id)

        const productExist = await Product.findOne({ vendorId: user.id, title });

        if(productExist){
            return res.status(400).json({
                success: false,
                message: "This product is already exist",
            })
        }

        const imagesUrl = [];

        if(Array.isArray(images)){
            for (const image of images) {
                const uploadImage = await fileUploadToCloudinary(image, process.env.CLOUD_FOLDER)
                imagesUrl.push(uploadImage.secure_url);
            }
        }

        // console.log(imagesUrl)


        const newProduct = await Product.create({
            vendorId : user.id,
            title,
            description,
            category : categoryId,
            price,
            weight,
            stock,
            images : imagesUrl,
        });


        return res.status(200).json({
            success: true,
            message: "Product create successfully",
            product : newProduct
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error.message
        });
    }
}



const getAllProduct = async (req, res) => {
    try {
        
        const allProduct = await Product.find().populate('vendorId').populate('category');


        return res.status(200).json({
            success: true,
            message: "Fetch all products",
            allProduct: allProduct
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


const getProductById = async (req, res) => {
    try {
        const {productId} = req.body;
        
        if(!productId){
            return res.status(400).json({
                success: false,
                message: "Please fill all mandatory fields"
            })
        }

        const product = await Product.findById(productId).populate('vendorId').populate('category');

        return res.status(200).json({
            success: true,
            message: 'Product fetch succesfully',
            product: product,
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error.message
        })
    }
}

const getAllPoductByCategory = async (req, res) => {
    try {
        const {categoryId} = req.body;

        if(!categoryId){
            return res.status(400).json({
                success: false,
                message: "Please fill all the mandatory fields"
            })
        }

        const allProduct = await Product.find({ category: categoryId }).populate('vendorId').populate('category')


        return res.status(200).json({
            success: true,
            message: "Fetch all product of a perticular category",
            allProduct : allProduct,
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`
        })
    }
}

module.exports = {addProduct, getAllProduct, getProductById, getAllPoductByCategory}