const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
    id: String, // Date:SLOTIME_VENUE
    date: Date,
    time: String,
    eventType: String, // Mi SI GD
    venue: [VenuesSchema],
    bookers: [StudentSchema]
});
const SlotModel = mongoose.model("Slot", SlotSchema);
module.exports = SlotModel;