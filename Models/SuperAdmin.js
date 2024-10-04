var mongoose = require("mongoose");

var SlotSchema = new mongoose.Schema({
    
    id : String, // Date:SLOTIME_VENUE
    date : Date,
    time : String,
    eventType : String, //Mi SI GD
    venue : [Venues],
    bookers : [Booking]
});

var SlotGeneratedSchema = new mongoose.Schema({
    eventType : String,
    date : Date,
    startTIme : String,
    endTime : String,
    isAvailable : Boolean
})

var VenuesSchema = new mongoose.Schema({
    venue : String,
    instructors : [{type:mongoose.Schema.Types.ObjectId , ref:'Staff'}], 
    limit : Number
})

var StaffSchema = new mongoose.Schema({
    _id : String,
    name : String,
    dept : String,
    phNo : String,
    email : String,
    eventHistory : [{type: mongoose.Schema.Types.ObjectId , ref: 'Event'}]
});

var AvailabilitySchema = new mongoose.Schema({
    instructorId : [{type:mongoose.Schema.Types.ObjectId , ref:'Staff' , required: true}],
    availableSlots : [{type:mongoose.Schema.Types.ObjectId, ref : 'SlotGenerated'}]
})

var StaffModel = mongoose.model("Staff",StaffSchema);
var VenuesModel = mongoose.model("Venues",VenuesSchema);
var SlotModel = mongoose.model("Slot",SlotSchema);
var SlotGeneratedModel = mongoose.model("SlotGenerated",SlotGeneratedSchema);
var AvailabilityModel = mongoose.model("Availability",AvailabilitySchema);

module.exports = {VenuesModel , SlotModel , SlotGeneratedModel , StaffModel , AvailabilityModel};
