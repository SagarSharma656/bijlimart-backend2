const express = require('express');
const router = express.Router();


const {auth, isWarehouse, isAdminOrWarehouse} = require('../middleware/auth')
const {addProduct, getAllProduct, getProductById, getAllPoductByCategory, deleteProduct} = require('../controller/Product')

router.post('/addProduct', auth, isWarehouse, addProduct);
router.get('/getAllProduct', getAllProduct);
router.get('/getProductById', getProductById);
router.get('/getAllPoductByCategory', getAllPoductByCategory);
router.delete('/deleteProduct', auth, isAdminOrWarehouse, deleteProduct)


module.exports = router;