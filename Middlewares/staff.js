const {StaffModel , AvailabilityModel} = require("../Models/AllModel");

// route : api/v1/Admin/getAvailability/:id
exports.getSlotAvailability = async (req , res )=>{
    const id = req.params.id;
    console.log(id);
    if(id === null || id === '') {
        res.status(500).json({message : "Please Enter Correct Data"})
    }
    try{
        const slots = await AvailabilityModel.findOne({instructorId : id});
        console.log(slots);
        const transformedSlots = transformSlots(slots.availableSlots);
        console.log(transformedSlots);
        res.status(200).json({slots : transformedSlots, message : 'Successfull'});
    }
    catch(e) {
        console.error("error",e);
        res.status(500).json({message : "Error Occered"})
    }
}
//route : api/v1/Admin/postAvailability/:id
exports.postAvaialability = async (req , res)=>{
    const id = req.params.id;
    console.log(id);
    console.log(await AvailabilityModel.findOne({instructorId:id}));
    res.status(200).json({message : 'Successfull'});
}
function transformSlots (schedule) {
    const result = [];
    schedule.forEach(e => {
        e.slots.forEach(slot => result.push(({date : e.date , time : slot.time , isAvailable : slot.isAvailable})));
    })
    return result
}