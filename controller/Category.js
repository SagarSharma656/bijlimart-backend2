const Category = require('../model/category');


const createCategory = async (req, res) => {
    try {
        const {name, description} = req.body

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Fill all the mandatory fields"
            });
        }

        const categoryExist = await Category.findOne({name : name});

        if(categoryExist){
            return res.status(400).json({
                success: false,
                message: "This category is already exist"
            })
        }

        const newCategory = await Category.create({
            name: name,
            description: description,
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
        const allCategories = await Category.find();

        return res.status(200).json({
            success: true,
            message: "Fetch all categories",
            categories : allCategories,
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

const updateCategory = async (req, res) => {
    try {
        const {categoryId, newName, newDescription} = req.body;

        if(!categoryId){
            return res.status(400).json({
                success: false,
                message: "Fill category Id"
            });
        }
        const existCategory = await Category.findById(categoryId);

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
                                                                  name: newName? newName : existCategory.name ,
                                                                  description: newDescription? newDescription : existCategory.description,  
                                                                });

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
        const {categoryId} = req.body

        if(!categoryId){
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

module.exports = {createCategory, allCategory, updateCategory, deleteCategory}