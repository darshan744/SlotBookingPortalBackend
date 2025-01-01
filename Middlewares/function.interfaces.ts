/**
 * Timings Grouped With Dates
 */

import mongoose from "mongoose";

export interface TimeAndAvailable {
    time: string; 
    isAvailable: string 
}
export interface IGroupDates {
    date: string; 
    availableSlots: TimeAndAvailable[] 
}

/**
 * 
 * Reduces GroupedDates
 * 
 */
export interface ISlotTimings {
    date: string;
    time: string;
    isAvailable: string
}

export interface IreGroupDate {
    date : string 
    slots : TimeAndAvailable[]
}

export interface IStudentMarks {
    id: string, name: string, attendance: string,
    ispresent: boolean, marks: number, remarks: string
}

export interface IEvents { 
    Name:string,
    Description:string,
    MaximumParticipants : number
}

export type TAvailability = {
    instructorId:  mongoose.Schema.Types.ObjectId;
    responseDeadline: Date;
    availableSlots: {
      date: Date
      slots: {
        time: string;
        isAvailable: string;
      }[];
    }[];
  }

export interface ISlotRequest {
    startDate:string;
    endDate:string;
    limit:number;
    year:string;
    eventType:string;
    slots:{
        time:string,
        limit:number
    }[]
    venuesAndStaffs : {
        venue:string ,
        staffs:string[]
    }[]
}


export type groupDates = { date: Date; slots: string[] };

export type staff = {
  _id: string;
  staffId: string;
  name: string;
};
