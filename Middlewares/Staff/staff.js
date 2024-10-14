const {StaffModel , AvailabilityModel} = require("../../Models/AllModel");
exports.getSlotAvailability = async (req , res )=>{
    const id = req.params.id;
    console.log(id);
    if(id === null || id === '') {
        res.status(500).json({message : "Please Enter Correct Data"})
    }
    try{
        const slots = await AvailabilityModel.findOne({instructorId : id});
        console.log(slots);
        const transformedSlots = transformSlots(slots);
        console.log(transformedSlots);
        res.status(200).json({slots : transformedSlots, message : 'Successfull'});
    }
    catch(e) {
        console.error("error",e);
        res.status(500).json({message : "Error Occered"})
    }
}
function groupByHours () {}

function transformSlots (slots) {
    const result = [];
    slots.availableSlots.forEach(e => result.push({
        date : new Date(e.date).toLocaleString("en-IN" , {
            year : 'numeric',
            month : '2-digit',
            day : '2-digit'
        }),slots : e.slots.map(slot => ({time : slot.time , isAvailable : slot.isAvailable}))
    })
)
    return result
}