
import mongoose from "mongoose"
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
    EventHistory:  IStudentEventResult[]
}
interface IBookingStatus {
    studentId: mongoose.Schema.Types.ObjectId,
    isBooked: boolean,
    bookingDate: Date | null,
    bookingTime: string | null,
    slotFinished : boolean 
}
interface IVenues extends Document {
    venue: string,
    staffs: string[],
    slots: { time: string, limit: number }[]
}
interface TimeSlot {
    time : string,
    limit : number,
}
interface IVenues2  {
    venue: string,
    staffs : {
        id:string,//staff id 
        slots:{
            date : Date ,
            timings : TimeSlot[]
        }[]
        //accepted timings alone will be kept here
    }[]
}
interface ISlot extends Document {
    slotId: string,
    startDate: Date,
    endDate: Date,
    eventType: string,
    year: string,
    slots: IVenues2[],
    bookers: IBookingStatus[]
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
    unmodifiedCount:number,
    responseDeadline : Date
    requestId : string,
    forYear:string,
    eventType: string,
    availableSlots:
    {
        date: Date,
        slots:
        {
            time: string,
            isAvailable: string
        }[]
    }[],

}

interface IRetrievalSlots extends Document {
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
interface ISettings extends Document {
    settingType : string,
}

interface IEvents  extends  ISettings{
    Name:string,
    Description:string,
    MaximumParticipants : number
}

interface IBreaks extends ISettings {
    configurationId: {type : string , unique:true},
    breaks : {
        morningBreak : string,
        eveningBreak : string,
        lunchStart : string,
        lunchEnd : string,
    }
}
export {
    IEvents,IAvailability, IBookingStatus, ISlot, ISlotGenerated, IStaff, IStudent,ISettings,
    IStudentEventResult, IVenues, IRetrievalSlots ,IUser ,IVenues2 ,TimeSlot ,IBreaks
}
