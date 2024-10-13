const express = require('express');
const router = express.Router();
const {getAllStaff,insertManyStaffs} = require('../Middlewares/SuperAdmin/getStaff')

/**One time route */
router.post('/insertManyStaffs',insertManyStaffs)

router.get('/getAllStaff',getAllStaff)
router.post('/requestAvailability',(req,res)=>{
    const obj = req.body;
    const {slots,startDate,endDate,staffs } = obj;
    console.log(slots, startDate , endDate ,staffs);
    var startdate = startDate.split('T')[0].split('-');
    var strtString = 
    res.status(200).json({message : 'Request Received'});
})

module.exports = router
