const { StaffModel, AvailabilityModel } = require('../../Models/SuperAdmin');
const {converToDate , assignToDate ,assignToStaff } = require('../miscellaneous')

exports.getAllStaff = async (req, res, next) => {
    try {
        const staffs = await StaffModel.find({}, 'name');
        res.json({
            success: true,
            staffs
        })
    }
    catch (e) {
        res.status(404).json({ success: false })
    }
}

exports.insertManyStaffs = async (req, res, next) => {
    try {
        const staffs = req.body;
        if (!Array.isArray(staffs)) {
            return res.status(400).json({ success: false, message: 'Invalid INput ' })
        }
        await staff.StaffModel.insertMany(staffs);
        res.json({ success: true })
    } catch (e) {
        res.json({ success: false, message: 'error Occured in inserting objects array' })

    }
}

exports.requestAvailability = async (req, res) => {
    const { slots, startDate, endDate, staffs } = req.body;
    if (!Array.isArray(slots) || !startDate || !endDate || !Array.isArray(staffs)) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }
    try {
        let startDateString = converToDate(startDate);
        let endDateString = converToDate(endDate);

        // console.log(startDateString, endDateString);
        const slotsGenerated = assignToDate(startDateString, endDateString, slots);
        const result = assignToStaff(staffs, slotsGenerated)
        

        const res = await AvailabilityModel.insertMany(result);
        console.log(res);
        res.status(200).json({ message: 'Request Received', result: result, slotsGenerated: slots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}
