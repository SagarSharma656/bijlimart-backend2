const mongoose = require("mongoose");

const Product = require("../model/productModel");
const { fileUploadToCloudinary, getPublicIdFromUrl, deteteFromCloudinary } = require("../utils/cloudinaryOperatios");
require('dotenv').config();
const Warehouse = require('../model/warehouseModel');
const Category = require('../model/category');
const Unit = require('../model/unitsModel');



const addProduct = async (req, res) => {
    try {
        const user = req.user;
        const { title, description, categoryId, subCategoryId, unitId, price, weight, stock } = req.body;
        const { images } = req.files;



        if (!title ||
            !description ||
            !categoryId ||
            !subCategoryId ||
            !unitId ||
            !price ||
            !weight ||
            !stock) {
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        if (!images || images.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Add atleast one image"
            })
        }

        // const warehouseId = new mongoose.Types.ObjectId(user.id)

        const productExist = await Product.findOne({ warehouseId: user.id, title });

        if (productExist) {
            return res.status(400).json({
                success: false,
                message: "This product is already exist",
            })
        }

        const imagesUrl = [];

        if (Array.isArray(images)) {
            for (const image of images) {
                const uploadImage = await fileUploadToCloudinary(image, process.env.CLOUD_FOLDER_PRODUCT, 70)
                imagesUrl.push(uploadImage.secure_url);
            }
        }

        // console.log(imagesUrl)


        const newProduct = await Product.create({
            warehouseId: user.id,
            title,
            description,
            category: categoryId,
            subCategory: subCategoryId,
            unit: unitId,
            price,
            weight,
            stock,
            images: imagesUrl,
        });


        return res.status(200).json({
            success: true,
            message: "Product create successfully",
            product: newProduct
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

        const allProduct = await Product.find()
                                        .populate('warehouseId')
                                        .populate('category')
                                        .populate('subCategory')
                                        .populate('unitId').exec();


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
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all mandatory fields"
            })
        }

        const product = await Product.findById(productId)
                                                .populate('warehouseId')
                                                .populate('category')
                                                .populate('subCategory')
                                                .populate('unitId').exec();

        const relatedProduct = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        })

        return res.status(200).json({
            success: true,
            message: 'Product fetch succesfully',
            product,
            relatedProduct
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
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the mandatory fields"
            })
        }

        const allProduct = await Product.find({ category: categoryId })
                                                    .populate('warehouseId')
                                                    .populate('category')
                                                    .populate('subCategory')
                                                    .populate('unitId').exec();


        return res.status(200).json({
            success: true,
            message: "Fetch all product of a perticular category",
            allProduct: allProduct,
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`
        })
    }
}

const addNewImages = async (req, res) => {
    try {
        const { productId, images } = req.files;

        if (!images) {
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        const existProduct = await Product.findById(productId);

        if (!existProduct) {
            return res.status(400).json({
                success: false,
                message: "Product not found"
            })
        }

        const imagesUrl = [];

        if (Array.isArray(images)) {
            for (const image of images) {
                const uploadImage = await fileUploadToCloudinary(image, process.env.CLOUD_FOLDER_PRODUCT, 70)
                imagesUrl.push(uploadImage.secure_url);
            }
        } else {
            const uploadImage = await fileUploadToCloudinary(image, process.env.CLOUD_FOLDER_PRODUCT, 70)
            imagesUrl.push(uploadImage.secure_url);
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            $addToSet: {
                images: {
                    $each: imagesUrl
                }
            }
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Images added succesfully",
            updatedProduct,
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

const deleteImage = async (req, res) => {
    try {
        const { productId, publicUrl } = req.body;

        if(!productId || !publicUrl){
            return res.status(400).json({
                success : false,
                message: "Fill all the mandatory fields",
            })
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            $pull : {
                images : publicUrl
            }
        }, { new: true });

        const response = await deteteFromCloudinary(getPublicIdFromUrl(publicUrl));

        return res.status(200).json({
            success: true,
            message: "Image delete succesfully"
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

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body

        if (!productId) {
            return res.status().json({
                success: false,
                message: "Fill all the mandatory fields"
            })
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status().json({
                success: false,
                message: "Product not found"
            })
        }

        const { warehouseId, categoryId, unitId, } = product;


        await Category.findByIdAndUpdate(warehouseId, {
            $pull: { product: productId }
        });

        await Category.findByIdAndUpdate(categoryId, {
            $pull: { product: productId }
        });

        await Category.findByIdAndUpdate(unitId, {
            $pull: { product: productId }
        });


        return res.status(200).json({
            success: true,
            message: 'Product delete succesfully'
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


module.exports = { 
            addProduct, 
            getAllProduct, 
            getProductById,
            getAllPoductByCategory, 
            addNewImages, 
            deleteImage, 
            deleteProduct 
        }
