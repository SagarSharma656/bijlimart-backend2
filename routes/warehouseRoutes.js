const express = require('express');
const router = express.Router();

const { warehouseLogin, sendOtpOnEmail, createWarehouse, getAllWarehouse, resetPasswordToken, resetPassword, findNearestWarehouse } = require('../controller/warehouseAuth')

const {auth, isWarehouse, isAdmin} = require('../middleware/auth')


router.post('/warehouseLogin', warehouseLogin);
router.post('/sendOtpOnEmail', sendOtpOnEmail);
router.post('/createwarehouse', auth, isAdmin, createWarehouse);
router.get('/getAllWarehouse', auth, isAdmin, getAllWarehouse);
router.post('/resetPasswordToken', resetPasswordToken);
router.post('/resetPassword', resetPassword);
router.post('/findNearestWarehouse', findNearestWarehouse);


module.exports = router;