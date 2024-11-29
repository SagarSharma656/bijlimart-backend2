const express = require('express');
const router = express.Router();


const {addProduct, getAllProduct, getProductById, getAllPoductByCategory, addNewImages, deleteImage, deleteProduct} = require('../controller/Product')
const {auth, isWarehouse, isAdminOrWarehouse} = require('../middleware/auth')


router.post('/addProduct', auth, isWarehouse, addProduct);
router.get('/getAllProduct', getAllProduct);
router.get('/getProductById', getProductById);
router.get('/getAllPoductByCategory', getAllPoductByCategory);
router.post('/addNewImages', auth, isAdminOrWarehouse, addNewImages);
router.post('/deleteImage', auth, isAdminOrWarehouse, deleteImage);
router.delete('/deleteProduct', auth, isAdminOrWarehouse, deleteProduct);


module.exports = router;