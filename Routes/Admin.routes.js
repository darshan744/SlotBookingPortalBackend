const express = require('express');
const {getSlotAvailability,postAvaialability} = require('../Middlewares/staff.middleware');
const router = express.Router();

router.get('/getAvailability/:id' , getSlotAvailability);
router.post('/postAvailability/:id',postAvaialability);
module.exports = router