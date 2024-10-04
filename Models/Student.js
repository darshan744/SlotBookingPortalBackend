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

var StudentModel = mongoose.model("Student",StudentSchema);
var StudentEventResultModel = mongoose.model("StudentEventResult",StudentEventResultSchema);
var BookingStatusModel = new mongoose.model("BookingStatus",BookingStatusSchema);

module.exports = {StudentModel,StudentEventResultModel,BookingStatusModel};

