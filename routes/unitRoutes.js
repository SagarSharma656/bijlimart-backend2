const express = require('express');
const router = express.Router();



const {createUnit, updateUnit, getAllUnits, getUnitById, deleteUnit} = require('../controller/Units')

const {auth, isAdmin, isWarehouse, isAdminOrWarehouse} = require('../middleware/auth')


router.post('/createUnit', auth, isAdmin, createUnit);
router.put('/updateUnit', auth, isAdmin, updateUnit);
router.get('/getAllUnits', auth, isAdminOrWarehouse, getAllUnits);
router.get('/getUnitById', auth, isAdminOrWarehouse, getUnitById);
router.delete('/deleteUnit', auth, isAdmin, deleteUnit);


module.exports = router