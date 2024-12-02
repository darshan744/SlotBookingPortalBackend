/**
 * Timings Grouped With Dates
 */

export interface TimeAndAvailable {
    time: string; 
    isAvailable: string 
}
export interface IGroupDates {
    date: Date; 
    availableSlots: TimeAndAvailable[] 
}

/**
 * 
 * Reduces GroupedDates
 * 
 */
export interface ISlotTimings {
    date: Date;
    time: string;
    isAvailable: string
}

export interface IreGroupDate {
    date : Date 
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