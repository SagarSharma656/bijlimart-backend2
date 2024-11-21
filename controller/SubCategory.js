const SubCategory = require('../model/subCategoryModel');
const Category = require('../model/category');


const craeteSubCategory = async (req, res) => {
    try {
        const { categoryId, name, description } = req.body

        if(!categoryId || !name){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        const subCategoryExist = await SubCategory.findOne({name: name});

        if(subCategoryExist){
            return res.status(400).json({
                success: false,
                message: "This sub category already exist"
            });
        }

        const newSubCategory = await SubCategory.create({
            name,
            description,
        });

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId, 
            { 
                $push: { 
                    subCategory : newSubCategory._id
                }
            },
            {new: true}
        );

        return res.status(200).json({
            success: true,
            message: "Sub category created succesfully",
            category : updatedCategory,
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

const getSubCategoryById = async (req, res) => {
    try {
        const { subCategoryId } = req.body;

        if(!subCategoryId){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        const subCategory = await SubCategory.findById(subCategoryId).populate('products');

        if(!subCategory){
            return res.status(400).json({
                success: false,
                message: "Not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Sub category fetched",
            subCategory
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

const updateSubCategory = async (req, res) => {
    try {
        const { subCategoryId, name, description } = req.body;

        if(!subCategoryId){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields",
            })
        }

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
                                                            subCategoryId, 
                                                            {name, description}, 
                                                            {new: true}
                                                        );
        
        return res.status(200).json({
            success: true,
            message: "Sub category updated succesfully",
            subCategory: updatedSubCategory,
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

const deleteSubCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.body;

        if(!categoryId || !subCategoryId){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }


        const updatedCategory = await Category.findByIdAndUpdate(
                                                            categoryId, 
                                                            {
                                                                $pull: {
                                                                    subCategory : subCategoryId
                                                                }
                                                            },
                                                            { new: true }).populate('products').populate('subCategory');

        await SubCategory.findByIdAndDelete(subCategoryId);

        return res.status(200).json({
            success: true,
            message: "Sub category delete successfully",
            category: updatedCategory,
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

module.exports = {craeteSubCategory, getSubCategoryById, updateSubCategory, deleteSubCategory}