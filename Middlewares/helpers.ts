import mongoose from "mongoose";
import { IGroupDates, IreGroupDate, ISlotTimings } from "./type.interfaces";


export type i = {
    instructorId: string;
    responseDeadline: Date,
    availableSlots: {
        date: Date;
        slots: {
            time: any;
            isAvailable: string
        }[]
    }[]
}

/**
 *
 * @param date
 */
export const converToDate = (date: string): string => {
    const startdate: string[] = date.split('T')[0].split('-');
    const years: string = startdate[0];
    const months: string = startdate[1];
    const day: string = startdate[2];
    return `${years}-${months.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export type groupDates = { date: Date; slots: string[] }
/**
 *
 * @param startDateStr Date 
 * @param endDateStr    Date
 * @param slots string[]
 */
export const assignToDate = (startDateStr: string, endDateStr: string, slots: string[]): groupDates[] => {
    const resultSlot: { date: Date; slots: string[] }[] = [];
    let startDate: Date = new Date(startDateStr);
    const endDate: Date = new Date(endDateStr);
    while (startDate <= endDate) {
        if (startDate.getDay() !== 0) {
            resultSlot.push({ date: startDate, slots: slots });
        }
        startDate.setDate(startDate.getDate() + 1);
    }
    return resultSlot;
}

type staff = {
    _id: string,
    staffId: string,
    name: string
}
/**
 *
 * @param staffs
 * @param slots
 */
export const assignToStaff = (staffs: staff[], slots: groupDates[], responseDeadline: Date): i[] => {
    const availabilityStaffArray: i[] = [];
    // let availabilityStaffArray = new Array<i>()
    staffs.forEach((staff) => {
        availabilityStaffArray.push({
            instructorId: staff._id,
            availableSlots: slots.map(slot => ({
                date: slot.date,
                slots: slot.slots.map((eachSlot: string) => ({
                    time: eachSlot,
                    isAvailable: 'unmodified',
                }))
            })),
            responseDeadline
        })
    });
    return availabilityStaffArray;
}

/**
 * @returns
 * An Array of Strings Displaying Hour Range in a single String 
 * @example 
 * [09:00 - 10:00 , 10:00 - 11:00 , 11:00 - 12:00]
 * 
 */
export const generateHoursForStaffs = (): string[] => {
    const resultSlots: string[] = [];
    const minutesToTime = (minutes: number): string => {
        const hours: number = Math.floor(minutes / 60);
        const min: number = Math.floor(minutes % 60);
        return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    }
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    let startTime: string = '8:45', endTime: string = '16:30';
    let startMinutes: number = timeToMinutes(startTime), endMinutes: number = timeToMinutes(endTime);
    const hr: number = 60;
    while (startMinutes <= endMinutes) {
        let timeInterval: string = `${minutesToTime(startMinutes)} - ${minutesToTime(startMinutes + hr)}`;
        if (timeInterval !== '12:45 - 13:45')
            if (timeInterval === '15:45 - 16:45')
                resultSlots.push('15:45 - 16:30');
            else
                resultSlots.push(timeInterval);

        startMinutes += hr;
    }
    return resultSlots;
}


/**
 * @param slots 
 * @paramType ISlotTimings []
 * @returns Returns an array of Objects By Grouping the Date
 * @returnType IGroupDates [] 
 */
export const reTransformSlots = (slots: ISlotTimings[]): IGroupDates[] => {

    return slots.reduce((acc: IGroupDates[], curr) => {
        const { date, time, isAvailable } = curr;
        let f = acc.find(e => e.date === date);
        if (!f) {
            f = { date, availableSlots: [] };
            acc.push(f);
        }
        f.availableSlots.push({ time, isAvailable });
        return acc;
    }, []);
}


export const toObjType = (obj: any) => obj as mongoose.Schema.Types.ObjectId;

/**
 * @param schedule 
 * @paramType IreGroupDate[]
 * @returns Converts IGroupedDates to ISlotTimings
 */
export const transformSlots: (schedule: IreGroupDate[]) => ISlotTimings[] =
    (schedule: IreGroupDate[]): ISlotTimings[] => {
        const result: { date: Date; time: string; isAvailable: string }[] = [];
        schedule.forEach(e => {
            console.log(e);
            e.slots.forEach(slot => result.push(({ date: e.date, time: slot.time, isAvailable: slot.isAvailable })));
        })
        return result.filter(e => e.isAvailable === 'unmodified');
    }

/**
 * @param slotTime  - has a string with venue and timing
 * @param venue - staff assigned venue
 * @type ({slotTime : string , venue :  string})
 * @return - whether the split string is same as venue
 */
export const venueMatch = (slotTime: string, venue: string): boolean => {
    if (slotTime !== null && slotTime !== undefined) {
        let slot = slotTime.split('|')[0].trim();
        return slot === venue;
    }
    return false;
}