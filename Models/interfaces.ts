
import mongoose from "mongoose"
import { VenuesSchema } from "./Venues.model";
import { BookingStatusSchema } from "./BookingStatus.model";
import { Document } from "mongoose";
import { StudentEventResultSchema } from "./StudentEventResult.model";

interface IStudentEventResult extends Document {
    resultId: string,
    eventType: string,
    isPresent: boolean,
    marks: number,
    remarks: string
}

interface IStudent extends IUser {
    department: string,
    year: string,
    upcomingEvent:string,
    resume: string,
    EventHistory: typeof StudentEventResultSchema[]
}

interface IVenues extends Document {
    venue: string,
    staffs: string[],
    slots: { time: string, limit: number }[]
}
interface ISlot extends Document {
    slotId: string,
    startDate: Date,
    endDate: Date,
    eventType: String,
    year: String,
    slots: typeof VenuesSchema[],
    bookers: typeof BookingStatusSchema[]
}
interface IStaff extends IUser {
    department: string,
    phNo: string,
    eventHistory: mongoose.Schema.Types.ObjectId[]
}
interface ISlotGenerated extends Document {
    date: Date,
    startTime: string,
    endTime: string,
    isAvailable: boolean
}
interface IAvailability extends Document {
    instructorId: mongoose.Schema.Types.ObjectId,
    unmodifiedCount: Number,
    deleteAt: Date,
    availableSlots:
    {
        date: Date,
        slots:
        {
            time: string,
            isAvailable: string
        }[]
    }[],
    responseDeadline : Date
}

interface IBookingStatus {
    studentId: mongoose.Schema.Types.ObjectId,
    isBooked: boolean,
    bookingDate: Date | null,
    bookingTime: string | null
}

interface IRetrivalSlots extends Document {
    startDate: string,
    endDate: string,
    bookers: {
        studentId: string,
        isBooked: boolean,
        bookingDate: string,
        bookingTime: string
    }[]
    slots: {
        venue: string[],
        staffs: string[],
        slots: { time: string, limit: number }[]
    }
}

interface IUser extends Document {
    id : string,
    name:string,
    email : string,
    password : string,
    userType:string,
    department: string,
}

export {
    IAvailability, IBookingStatus, ISlot, ISlotGenerated, IStaff, IStudent,
    IStudentEventResult, IVenues, IRetrivalSlots ,IUser
}
