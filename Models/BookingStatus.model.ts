
import mongoose from "mongoose";
import {IBookingStatus} from './interfaces';

export const BookingStatusSchema = new mongoose.Schema<IBookingStatus>({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    isBooked: { type: Boolean, default: false },
    bookingTime: { type: String }
});
export const BookingStatusModel =  mongoose.model("BookingStatus",BookingStatusSchema);

