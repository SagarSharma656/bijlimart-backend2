const Category = require('../model/category');
const { fileUploadToCloudinary, getImageIdFromUrl, deteteFromCloudinary, fileUpdateToCloudinary } = require('../utils/cloudinaryOperatios')


const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const { categoryImage } = req.files;

        if (!name || !description || !categoryImage) {
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        const categoryExist = await Category.findOne({ name: name });

        if (categoryExist) {
            return res.status(400).json({
                success: false,
                message: "This category is already exist"
            })
        }

        const uploadedImage = await fileUploadToCloudinary(categoryImage, process.env.CLOUD_FOLDER_CATEGORY, 70);

        const newCategory = await Category.create({
            name: name,
            description: description,
            image: uploadedImage.secure_url,
        });

        return res.status(200).json({
            success: true,
            message: "New category created",
            newCategory,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`,
        });
    }
}

const allCategory = async (req, res) => {
    try {
        const allCategories = await Category.find().populate('products').populate('subCategory');

        return res.status(200).json({
            success: true,
            message: "Fetch all categories",
            categories: allCategories,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`,
            error: error.message
        })
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            })
        }

        const category = await Category.findById(categoryId).populate('products').populate('subCategory').exec();

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched",
            category
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error : ${error.message}`,
            error: error.message,
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { categoryId, newName, newDescription } = req.body;

        const { newImage } = req.files;


        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Fill category Id"
            });
        }
        const existCategory = await Category.findById(categoryId);

        

        let updatedImage;
        if (newImage) {
            await deteteFromCloudinary(process.env.CLOUD_FOLDER_CATEGORY, getImageIdFromUrl(existCategory.image));
            updatedImage = await fileUploadToCloudinary(newImage, process.env.CLOUD_FOLDER_CATEGORY, 70);
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
            name: newName,
            description: newDescription,
            image: updatedImage.secure_url,
        }, {new: true}).populate('products').populate('subCategory').exec();


        return res.status(200).json({
            success: true,
            message: "Category update succsfully",
            updatedCategory,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`,
            error: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.body

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Please fill category id"
            });
        }

        await Category.findByIdAndDelete(categoryId);

        return res.status(200).json({
            success: true,
            message: "Category delete succesfully"
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Erorr : ${error.message}`,
            error: error.message,
        })
    }
}

module.exports = { createCategory, allCategory, updateCategory, deleteCategory, getCategoryById }