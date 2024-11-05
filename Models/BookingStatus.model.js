const mongoose = require("mongoose");
const BookingStatusSchema = new mongoose.Schema({
    studentId : mongoose.Types.ObjectId,
    isBooked : {type : Boolean , default : false},
    bookingTime : String
});
const BookingStatusModel =  mongoose.model("BookingStatus",BookingStatusSchema);
module.exports = {BookingStatusModel ,BookingStatusSchema };