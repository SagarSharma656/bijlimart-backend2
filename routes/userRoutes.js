const express = require('express');
const router = express.Router();


const {userLoginSignUp} = require('../controller/UserAuth');
const {} =require('../middleware/auth');

router.post('/userLoginSignUp', userLoginSignUp);


module.exports = router;