const express = require('express');
const router = express.Router();

const { warehouseLogin,
    createWarehouse,
    getAllWarehouse,
    resetPasswordToken,
    resetPassword,
    findNearestWarehouse,
    lowStockAlert,
    markAvailableOrNot,
     updateStock } = require('../controller/warehouseAuth')

const { auth, isWarehouse, isAdmin } = require('../middleware/auth')


router.post('/warehouseLogin', warehouseLogin);
router.post('/createwarehouse', auth, isAdmin, createWarehouse);
router.get('/getAllWarehouse', auth, isAdmin, getAllWarehouse);
router.post('/resetPasswordToken', resetPasswordToken);
router.post('/resetPassword', resetPassword);
router.post('/findNearestWarehouse', findNearestWarehouse);
router.post('/lowStockAlert', lowStockAlert);
router.post('/updateStock', updateStock);
router.post('/markAvailableOrNot', markAvailableOrNot);


module.exports = router;