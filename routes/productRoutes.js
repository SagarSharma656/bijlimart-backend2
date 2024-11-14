const express = require('express');
const router = express.Router();


const {auth, isVendor} = require('../middleware/auth')
const {addProduct, getAllProduct, getProductById, getAllPoductByCategory} = require('../controller/Product')

router.post('/addProduct', auth, isVendor, addProduct)
router.get('/getAllProduct', getAllProduct)
router.get('/getProductById', getProductById)
router.get('/getAllPoductByCategory', getAllPoductByCategory)


module.exports = router;