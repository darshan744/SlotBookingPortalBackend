const mongoose = require("mongoose");
const VenuesSchema = new mongoose.Schema({
    venue: String,
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
    limit: Number
});
const VenuesModel = mongoose.model("Venues", VenuesSchema);
module.exports = {VenuesModel , VenuesSchema};