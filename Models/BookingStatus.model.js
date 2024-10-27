const mongoose = require("mongoose");
const BookingStatusSchema = new mongoose.Schema({
    studentId : String,
    isBooked : Boolean,
    bookingTime : String
});
const BookingStatusModel =  mongoose.model("BookingStatus",BookingStatusSchema);
module.exports = BookingStatusModel;