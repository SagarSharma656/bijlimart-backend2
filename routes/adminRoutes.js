const express = require('express');
const router = express.Router();

const { adminLogin, adminSignUp } = require('../controller/AdminAuth');
const { auth, isAdmin } = require('../middleware/auth')


router.post('/login', adminLogin);
router.post('/signUp', adminSignUp);


module.exports = router