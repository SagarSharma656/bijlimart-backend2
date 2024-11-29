const express = require('express');
const router = express.Router();



const { sendOtpOnEmail, addDeliveryBoy, blockAndUnblockDeliveryBoy, changeBasicDetailsOfDeliveryBoy, changeAvailableStatusOfDeliveryBoy } = require('../controller/DeliveryBoy');
const {auth, isAdmin, isDeliveryBoy} = require('../middleware/auth');



router.post('/sendOtpOnEmail', auth, isAdmin, sendOtpOnEmail);
router.post('/addDeliveryBoy', auth, isAdmin, addDeliveryBoy);
router.post('/blockAndUnblockDeliveryBoy', auth, isAdmin, blockAndUnblockDeliveryBoy);
router.post('/changeBasicDetailsOfDeliveryBoy', auth, isDeliveryBoy, changeBasicDetailsOfDeliveryBoy);
router.post('/changeAvailableStatusOfDeliveryBoy', auth, isDeliveryBoy, changeAvailableStatusOfDeliveryBoy);


module.exports = router;