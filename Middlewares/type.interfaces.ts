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

export type IAvailability = {
    instructorId: string | mongoose.Types.ObjectId;
    responseDeadline: Date;
    availableSlots: {
      date: Date;
      slots: {
        time: any;
        isAvailable: string;
      }[];
    }[];
  };

export type groupDates = { date: Date; slots: string[] };

export type staff = {
  _id: string;
  staffId: string;
  name: string;
};
