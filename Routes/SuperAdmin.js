const express = require('express');
const router = express.Router();
const {getAllStaff,insertManyStaffs,requestAvailability} = require('../Middlewares/superAdmin')

/**One time route */
router.post('/insertManyStaffs',insertManyStaffs)

router.get('/getAllStaff',getAllStaff)
router.post('/requestAvailability',requestAvailability)

module.exports = router
