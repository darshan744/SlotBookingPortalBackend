const StaffModel = require('../Models/Staff.model')
const AvailabilityModel = require('../Models/Availability.model');
const { assignToDate, assignToStaff, generateHoursForStaffs } = require('./helpers.middleware')

exports.getAllStaffs  = async (req, res, next) => {
    try {
        const staffs = await StaffModel.find({}, { 'name': 1, 'staffId': 1 });
        res.json({
            success : true,
            data : staffs
        })
    }
    catch (e) {
        res.status(404).json({ success: false })
    }
}

exports.createStaffs = async (req, res, next) => {
    try {
        const staffs = req.body;
        if (!Array.isArray(staffs)) {
            return res.status(400).json({ success: false, message: 'Invalid INput ' })
        }
        await staffs.StaffModel.insertMany(staffs);
        res.json({ success: true })
    } catch (e) {
        res.json({ success: false, message: 'error Occured in inserting objects array' })

    }
}
//api/v1/superAdmin/requestAvailability
exports.requestAvailability = async (req, res) => {
    const { startDate, endDate, staffs } = req.body;
    if (!startDate || !endDate || !Array.isArray(staffs)) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }
    let slots = generateHoursForStaffs();
    try {
        const slotsGenerated = assignToDate(startDate, endDate, slots);
        const result = assignToStaff(staffs, slotsGenerated)
        console.log(result);
        await AvailabilityModel.insertMany(result);
        res.json({ message: 'Request Received And Success' });
    } catch (error) {
        console.error("Error" + error);
        res.json({ success: false, message: error.message })
    }

}
//api/v1/superAdmin/getAllResponse
exports.getAllResponses = async (req, res) => {
    let dbData = await AvailabilityModel.find({}).populate({
        path: 'instructorId',
        select: 'staffId name email phNo -_id'
    });
    let results = dbData.map((el) => ({
        staffId: el.instructorId.staffId,
        phoneNumber: el.instructorId.phNo,
        name: el.instructorId.name,
        email: el.instructorId.email,
        unmodifiedCount: el.unmodifiedCount
    })
    );
    res.status(200).json({
        message: 'Success', result: results
    });
}
//api/v1/superAdmin/responses/:id
exports.getResponseById = async (req, res) => {
    let id = req.params.id;
    /*interface Slot {
    time: string;
    isAvailable: "Accepted" | "Declined"; // Adjust as needed
}

interface AvailableSlot {
    date: string; // Or Date if you prefer
    slots: Slot[];
}

interface Staff {
    staffId: string;
    name: string;
    availableSlots: AvailableSlot[];
}*/
    try {
        let results = await AvailabilityModel.aggregate([
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $unwind: '$staff'
            },
            {
                $match: {
                    'staff.staffId': id,
                    'availableSlots.slots.isAvailable': 'Accepted' // Filter for available slots
                }
            },
            {
                $unwind: '$availableSlots'
            },
            {
                $unwind: '$availableSlots.slots'
            },
            {
                $match: {
                    'availableSlots.slots.isAvailable': 'Accepted'
                }
            },
            {
                $group: {
                    _id: {
                        staffId: '$staff.staffId',
                        name: '$staff.name',
                        mail: '$staff.mail',
                        date: '$availableSlots.date'
                    },
                    slots: {
                        $push: {
                            time: '$availableSlots.slots.time',
                            isAvailable: '$availableSlots.slots.isAvailable'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        staffId: '$_id.staffId',
                        name: '$_id.name',
                        mail: '$_id.mail'
                    },
                    availableSlots: {
                        $push: {
                            date: '$_id.date',
                            slots: '$slots'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    staffId: '$_id.staffId',
                    name: '$_id.name',
                    mail: '$_id.mail',
                    availableSlots: 1
                }
            }
        ]);

        res.status(200).json({
            message: "Success", Result: results[0]
        });
    }
    catch (e) {
        res.status(404).json({ message: `Error Occured`, error: e })
    }
}
//api/v1/SuperAdmin/responses/accepted
exports.getAcceptedResponse = async (req , res) => {
    try {
       const result =  await AvailabilityModel.find({unmodifiedCount : 0},{'availableSlots':0 ,
         '_id':0,'__v':0}).populate({
           path:'instructorId',select : 'name staffId -_id ' 
       });
       if(result.length === 0) {
           res.status(404).json({success : false , message : "Theres no matching found"})
       }
       else {
        res.status(200).json({success : true , data : result});
       }
   } catch (e) {
        res.status(500).json({success: false , message : "Unknown Error Occured in Server"})
   }

}