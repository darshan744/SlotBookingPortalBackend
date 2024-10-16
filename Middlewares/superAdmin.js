const { StaffModel, AvailabilityModel } = require('../Models/AllModel');
const {converToDate , assignToDate ,assignToStaff,generateHoursForStaffs } = require('./miscellaneous')

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
        await staffs.StaffModel.insertMany(staffs);
        res.json({ success: true })
    } catch (e) {
        res.json({ success: false, message: 'error Occured in inserting objects array' })

    }
}

exports.requestAvailability = async (req, res) => {
    const {startDate, endDate, staffs } = req.body;
    if (!startDate || !endDate || !Array.isArray(staffs)) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }
    let slots = generateHoursForStaffs();
    try {
        const slotsGenerated = assignToDate(startDate, endDate, slots);
        const result = assignToStaff(staffs, slotsGenerated)
        console.log(result);

        await AvailabilityModel.insertMany(result);
        res.json({ message: 'Request Received', result: result, slotsGenerated: slotsGenerated });
    } catch (error) {
        console.error("Error" + error);
        res.json({ success: false, message: error.message })
    }

}