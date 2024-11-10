import  mongoose from "mongoose"
import { VenuesSchema } from "./Venues.model";
import { BookingStatusSchema } from "./BookingStatus.model";
import { StudentEventResultSchema } from "./StudentEventResult.model";

interface IStudentEventResult {
    id : string,
    eventType : string,
    isPresent : boolean,
    marks  :number,
    remarks : string
}

interface IStudent {
    studentId:String,
    name : String,
    department  :String,
    email:String,
    year : String,
    password : String,
    resume :{type : String},
    EventHistory : typeof StudentEventResultSchema[]
}
interface IVenues {
    venue : string,
    staffs :  string[],
    slots : {time : string,limit : number}[]
}
interface ISlot {
    id : string,
    startDate : Date,
    endDate : Date,
    eventType : String,
    year : String,
    slots : typeof VenuesSchema[],
    bookers : typeof BookingStatusSchema[]
}
interface IStaff {
    staffId : string,
    name: string,
    dept: string,
    phNo: string,
    email: string,
    eventHistory: mongoose.Schema.Types.ObjectId[]
}
interface ISlotGenerated {
    date: Date,
    startTime: string,
    endTime: string,
    isAvailable: boolean
}
interface IAvailability {
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

interface IBookingStatus {
    studentId : mongoose.Schema.Types.ObjectId,
    isBooked : boolean,
    bookingTime : string
}

export {IAvailability ,IBookingStatus , ISlot , ISlotGenerated , IStaff , IStudent ,
    IStudentEventResult, IVenues
}