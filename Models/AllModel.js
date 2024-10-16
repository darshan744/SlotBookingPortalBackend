var mongoose = require("mongoose");

var StudentEventResultSchema = new mongoose.Schema({
    _id:String,
    eventType : String,
    isPresent:Boolean,
    marks:Number,
    remarks: String,
})

var StudentSchema = new mongoose.Schema({
    _id:String,
    name : String,
    department  :String,
    resume:{type : String},
    EventHistory : [{type : StudentEventResultSchema , ref: 'Event'}]
});

var BookingStatusSchema = new mongoose.Schema({
    studentId : String,
    isBooked : Boolean,
    bookingTime : String
});

// Define VenuesSchema first
var VenuesSchema = new mongoose.Schema({
    venue: String,
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
    limit: Number
});

// Then define SlotGeneratedSchema for request 
var SlotGeneratedSchema = new mongoose.Schema({
    date: Date,
    startTime: String,
    endTime: String,
    isAvailable: Boolean
});

// Now define SlotSchema
var SlotSchema = new mongoose.Schema({
    id: String, // Date:SLOTIME_VENUE
    date: Date,
    time: String,
    eventType: String, // Mi SI GD
    venue: [VenuesSchema],
    bookers: [StudentSchema]
});

// Define StaffSchema after that
var StaffSchema = new mongoose.Schema({
    _id: String,
    name: String,
    dept: String,
    phNo: String,
    email: String,
    eventHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

// Define AvailabilitySchema last
var AvailabilitySchema = new mongoose.Schema({
    instructorId: { type: String, ref: 'Staff', required: true },
    availableSlots: [{ type:{date : String , slots : [{
        time : String,
        isAvailable : { type : String },
    }]} }]
});
// Create models
var StaffModel = mongoose.model("Staff", StaffSchema);
var VenuesModel = mongoose.model("Venues", VenuesSchema);
var SlotModel = mongoose.model("Slot", SlotSchema);
var SlotGeneratedModel = mongoose.model("SlotGenerated", SlotGeneratedSchema);
var AvailabilityModel = mongoose.model("Availability", AvailabilitySchema);
var StudentModel = mongoose.model("Student",StudentSchema);
var StudentEventResultModel = mongoose.model("StudentEventResult",StudentEventResultSchema);
var BookingStatusModel =  mongoose.model("BookingStatus",BookingStatusSchema);

// Export models
module.exports = { VenuesModel, SlotModel, SlotGeneratedModel, StaffModel,
     AvailabilityModel,StudentModel,StudentEventResultModel,BookingStatusModel };
