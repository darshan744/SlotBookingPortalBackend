const StaffModel = require('../Models/Staff.model')
const AvailabilityModel = require("../Models/Availability.model");
const {transformSlots,reTransformSlots } = require('./helpers.middleware');
const mongoose = require('mongoose');

// route : api/v1/Admin/getAvailability/:id
exports.getSlotAvailability = async (req, res) => {
    let id = await StaffModel.findOne({staffId : req.params.id},'_id');
    id = id._id
    // console.log(id);
    if (id === null || id === '') {
        res.status(500).json({ message: "Please Enter Correct Data"})
    }
    try {
        const slots = await AvailabilityModel.findOne({instructorId: id});
        const transformedSlots = transformSlots(slots.availableSlots);
        res.status(200).json({ slots: transformedSlots, message: 'Successfull' ,id:id});
    }
    catch (e) {
        console.error("error", e.message);
        res.status(500).json({ message: "Error Occered",error : e.message})
    }
}

//route : api/v1/Admin/postAvailability/:id
exports.postAvaialability = async (req, res) => {
    let id = await StaffModel.findOne({staffId : req.params.id},'_id');
    id = id._id
    const availabilites = req.body;
    // console.log(id);
    const reTransformedSlots = reTransformSlots(availabilites);
    // console.log(reTransformedSlots);
    try {
        const userAvailability = await AvailabilityModel.findOne({ instructorId: id });
        if (!userAvailability) {
            res.status(404).json({ message: "cannot find user" });
        }
        reTransformedSlots.forEach(slotObj/*{date : '',availableSlots:{time : '',isAvailable:''}[]*/ => {

            let existingDate = userAvailability.availableSlots.find(e => e.date === slotObj.date);
            if (existingDate) {
                existingDate.slots.forEach(slot => {
                    // console.log("Slot : " + slot);
                    let receivedSlotUpdate = slotObj.availableSlots.find(s => s.time === slot.time);
                    // console.log(" ReceivedSlotUpdate : " + receivedSlotUpdate);
                    if (receivedSlotUpdate) {
                        slot.isAvailable = receivedSlotUpdate.isAvailable;
                    }
                    //receivees the update that is entered for that specific time ;
                });
            }
        });
        await userAvailability.save();
        res.json({ message: "Success", sltos: userAvailability })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e + "error occured" });
    }

}
