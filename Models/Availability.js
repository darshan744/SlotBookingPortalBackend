const mongoose = require("mongoose");
const AvailabilitySchema = new mongoose.Schema({
    instructorId: { type: String, ref: 'Staff', required: true },
    availableSlots: [{ type:{date : String , slots : [{
        time : String,
        isAvailable : { type : String },
    }]}}]
});
const AvailabilityModel = mongoose.model("Availability", AvailabilitySchema);
module.exports = {AvailabilityModel};