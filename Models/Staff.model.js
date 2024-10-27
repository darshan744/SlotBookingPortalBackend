const mongoose = require("mongoose");
const StaffSchema = new mongoose.Schema({
    _id: String,
    name: String,
    dept: String,
    phNo: String,
    email: String,
    eventHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});
const StaffModel = mongoose.model("Staff", StaffSchema);
module.exports = StaffModel;