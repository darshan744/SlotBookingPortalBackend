const express = require('express');
const router = express.Router();
const {getAllResponse,getAllStaff,insertManyStaffs,getIndividualResponse,
        requestAvailability} = require('../Middlewares/superAdmin.middleware');


/**One time route */
router.post('/insertManyStaffs',insertManyStaffs)
router.get('/getAllStaff',getAllStaff)
router.post('/requestAvailability',requestAvailability)
router.get('/getAllResponse',getAllResponse)
router.get('/getIndividualResponse/:id',getIndividualResponse)

module.exports = router
