const express = require('express');
const router = express.Router();
const { getAllResponses,getAllStaffs,createStaffs,getResponseById,
        requestAvailability,getAcceptedResponse , slots} = require('../Middlewares/superAdmin.middleware');



//api/v1/SuperAdmin
router.post('/staffs/availability',requestAvailability)
router.post('/staffs',createStaffs)
router.get('/staffs',getAllStaffs )
router.get('/responses/accepted',getAcceptedResponse);
router.get('/responses/:id',getResponseById)
router.get('/responses',getAllResponses)
router.post('/slots',slots);

module.exports = router
