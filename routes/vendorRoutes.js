const express = require('express');
const router = express.Router();

const { vendorLogin, sendOtpOnEmail, createVendor, getAllVendor } = require('../controller/VendorAuth')

const {auth, isVendor, isAdmin} = require('../middleware/auth')


router.post('/venderLogin', vendorLogin);
router.post('/sendOtpOnEmail', sendOtpOnEmail);
router.post('/createVendor', auth, isAdmin, createVendor);
router.get('/getAllVendor', auth, isAdmin, getAllVendor);


module.exports = router