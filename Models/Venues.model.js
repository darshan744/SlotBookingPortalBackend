const mongoose = require("mongoose");
const VenuesSchema = new mongoose.Schema({
    venue: String,
    staffs: [{ type: String, ref: 'Staff' }],
    slots : [{
        time : String , 
        limit : Number
    }]
});
const VenuesModel = mongoose.model("Venues", VenuesSchema);
module.exports = {VenuesModel , VenuesSchema};