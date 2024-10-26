const mongoose = require("mongoose");
const SlotGeneratedSchema = new mongoose.Schema({
    date: Date,
    startTime: String,
    endTime: String,
    isAvailable: Boolean
});
const SlotGeneratedModel = mongoose.model("SlotGenerated", SlotGeneratedSchema);
module.exports = SlotGeneratedModel;