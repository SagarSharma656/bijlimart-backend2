const express = require('express');
const router = express.Router();


const {craeteSubCategory, getSubCategoryById, updateSubCategory, deleteSubCategory} = require('../controller/SubCategory')
const {auth, isAdmin} = require('../middleware/auth')


router.post('/craeteSubCategory', auth, isAdmin, craeteSubCategory);
router.get('/getSubCategoryById', getSubCategoryById);
router.put('/updateSubCategory', auth, isAdmin, updateSubCategory);
router.delete('/deleteSubCategory', auth, isAdmin, deleteSubCategory);


module.exports = router;