
import  mongoose from "mongoose"
import { VenuesSchema } from "./Venues.model";
import { BookingStatusSchema } from "./BookingStatus.model";
import { Document } from "mongoose";
import { StudentEventResultSchema } from "./StudentEventResult.model";

interface IStudentEventResult extends Document {
    resultId : string,
    eventType : string,
    isPresent : boolean,
    marks  :number,
    remarks : string
}

interface IStudent extends Document {
    studentId:String,
    name : String,
    department  :String,
    email:String,
    year : String,
    password : String,
    resume :{type : String},
    EventHistory : typeof StudentEventResultSchema[]
}
interface IVenues  extends Document {
    venue : string,
    staffs :  string[],
    slots : {time : string,limit : number}[]
}
interface ISlot  extends Document{
    slotId : string,
    startDate : Date,
    endDate : Date,
    eventType : String,
    year : String,
    slots : typeof VenuesSchema[],
    bookers : typeof BookingStatusSchema[]
}
interface IStaff extends Document {
    staffId : string,
    name: string,
    dept: string,
    phNo: string,
    email: string,
    eventHistory: mongoose.Schema.Types.ObjectId[]
}
interface ISlotGenerated extends Document {
    date: Date,
    startTime: string,
    endTime: string,
    isAvailable: boolean
}
interface IAvailability  extends Document{
    instructorId : mongoose.Schema.Types.ObjectId,
    unmodifiedCount : Number,
    deleteAt: Date,
    availableSlots : 
    {
        date : string ,
         slots: 
         {
            time : string,
            isAvailable:string
        }[]
    }[]
}

interface IBookingStatus  {
    studentId : mongoose.Schema.Types.ObjectId,
    isBooked : boolean,
    bookingDate : Date | null,
    bookingTime : string | null
}

interface IRetrivalSlots extends Document {
    startDate : string,
    endDate : string,
    bookers : {
        studentId : string,
        isBooked : boolean,
        bookingDate : string,
        bookingTime : string
    }[]
    slots : {
        venue : string[],
        staffs : string[],
        slots : { time : string , limit : number }[]
    }
}

export {IAvailability ,IBookingStatus , ISlot , ISlotGenerated , IStaff , IStudent ,
    IStudentEventResult, IVenues , IRetrivalSlots
}