const express = require('express');
const {getSlotAvailability} = require('../Middlewares/Staff/staff');
const router = express.Router();

router.get('/getAvailability/:id' , getSlotAvailability)
module.exports = router