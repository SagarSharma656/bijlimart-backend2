const express = require('express');
const router = express.Router();


const { sendOtpOnEmail, sendOtpOnWhatsapp } = require('../controller/OTP')

router.post('/sendOtpOnEmail', sendOtpOnEmail);
router.post('/sendOtpOnWhatsapp', sendOtpOnWhatsapp);

module.exports = router;