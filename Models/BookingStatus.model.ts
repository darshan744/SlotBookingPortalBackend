
import mongoose from "mongoose";
import {IBookingStatus} from './interfaces';

export const BookingStatusSchema = new mongoose.Schema<IBookingStatus>({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    isBooked: { type: Boolean, default: false },
    slotFinished: {type : Boolean , default : false},
    bookingDate : {type : Date },
    bookingTime: { type: String }
},{_id : false});
// export const BookingStatusModel =  mongoose.model("BookingStatus",BookingStatusSchema);

