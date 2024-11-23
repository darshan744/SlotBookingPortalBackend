/**
 * Timings Grouped With Dates
 */

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