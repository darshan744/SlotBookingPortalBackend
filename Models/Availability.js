const mongoose = require("mongoose");
const AvailabilitySchema = new mongoose.Schema({
    instructorId: { type: String, ref: 'Staff', required: true },
    unmodifiedCount: { type: Number, default: 0 },
    availableSlots: [{
        type: {
            date: String,
            slots: [{
                time: String,
                isAvailable: { type: String },
            }]
        }
    }]
});
function unmodifiedCountHelper(next) {
    const count = 0;
    for (const slot of this.availableSlots) {
        slot.slots.forEach(element => {
            if(isAvailable === 'unmodified') {
                count++;
            }
        }); 
    }
    this.unmodifiedCount = count;
    next();
}
AvailabilitySchema.pre("save",unmodifiedCountHelper)
AvailabilitySchema.pre("updateOne",unmodifiedCountHelper)
const AvailabilityModel = mongoose.model("Availability", AvailabilitySchema);

module.exports = { AvailabilityModel };