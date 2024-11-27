const express = require('express');
const router = express.Router();

const {createCategory, allCategory, updateCategory, getCategoryById, deleteCategory} = require('../controller/Category');

const {auth, isAdmin} = require('../middleware/auth')


router.post('/createCategory', auth, isAdmin, createCategory);
router.get('/allCategory', allCategory);
router.put('/updateCategory', auth, isAdmin, updateCategory);
router.get('/getCategoryById', getCategoryById);
router.delete('/deleteCategory', auth, isAdmin, deleteCategory);


module.exports = router;

