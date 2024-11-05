const mongoose = require("mongoose");
const {VenuesSchema} = require('./Venues.model');
const {BookingStatusSchema} = require('./BookingStatus.model')
const SlotSchema = new mongoose.Schema({
    id: String, // Date:SLOTIME_VENUE
    startDate: Date,
    endDate: Date,
    eventType: String, 
    year : String,// Mi SI GD
    // slots : [{
    //     venue : String , 
    //     staffs : [{type : String}] , 
    //     slots : [{
    //         time : String , 
    //         limit : Number
    //     }]
    // }],
    slots : [VenuesSchema],
    bookers: [{type : BookingStatusSchema , ref : 'BookingStatus'}]
});
const SlotModel = mongoose.model("Slot", SlotSchema);
module.exports = SlotModel;