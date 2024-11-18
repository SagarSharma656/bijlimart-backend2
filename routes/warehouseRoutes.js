const express = require('express');
const router = express.Router();

const { warehouseLogin, sendOtpOnEmail, createWarehouse, getAllWarehouse } = require('../controller/warehouseAuth')

const {auth, isWarehouse, isAdmin} = require('../middleware/auth')


router.post('/venderLogin', warehouseLogin);
router.post('/sendOtpOnEmail', sendOtpOnEmail);
router.post('/createwarehouse', auth, isAdmin, createWarehouse);
router.get('/getAllwarehouse', auth, isAdmin, getAllWarehouse);


module.exports = router;