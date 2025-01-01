import {ISlotRequest, TAvailability} from "../Middlewares/function.interfaces";
import {TimeSlot} from '../Models/interfaces'

/**
 *
 * @param minutes Number containing the minutes
 * @return string in format of 09:00
 */
function minutesToTime(minutes: number): string {
    const hours: number = Math.floor(minutes / 60);
    const min: number = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

/**
 *
 * @param time string  format 09:00
 * @returns number which is the minutes
 */
function timeToMinutes (time: string): number {
    const [hours, minutes] : number[] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
/**
 *
 * @param staffTimings   staff's accepted Timing
 * @param slotTiming   slot timings that is created
 * @return True or False whether the slot timing is with in the range of the staffs
 * accepted timings
 */

function isWithinRange (staffTimings : string /* 09:00 - 10:00 */,
                      slotTiming : string /* 09:00 - 09:15 */) : boolean {
    const staffTimingInMinutes : number = timeToMinutes(staffTimings.split('-')[1].trimStart());//end timing of staff slots
    const slotTimingInMinutes : number = timeToMinutes(slotTiming.split('-')[1].trimStart());
    return slotTimingInMinutes <= staffTimingInMinutes;
}
type TStaffAcceptedTimings = Pick<TAvailability, "availableSlots" | "instructorId"> & {id : string}

type TSlots = ISlotRequest['slots'][0];
type TResultType =  Array<{
    venue: string,
    staffs: {
    id: string,
        slots: {
        date: Date,
        timings: TimeSlot[]
    }[]
}[]
}>;


/**
 *
 * @param venueAndStaffs the venues and staff mapped to the venues
 * @param slots the slot timings that is generated in frontend
 * @param staffAcceptedTimings the accepted timings of the staff
 * @desc Maps the created slots in the frontend to the accepted staff's timing and
 * creates the slot timings with mapping with the staffs corresponding venue
 */
export function mapTimings (venueAndStaffs : ISlotRequest['venuesAndStaffs'] ,slots : TSlots[],
                     staffAcceptedTimings : TStaffAcceptedTimings[]) {
    let result: TResultType  = [] as any;
    let hours  = groupTimings(slots , generateHours());
    for(const venue of venueAndStaffs) {
        let data :TResultType[0] = {
            venue : venue.venue,
            staffs : venue.staffs.map(e=> ({
                id : e,
                slots : (()=>{
                    let id = staffAcceptedTimings.find(s=> s.id === e)!;
                    return id.availableSlots.map(slot => ({
                        date: slot.date,
                        timings: slot.slots.map(l => hours[l.time].slots).flat()
                    }));
                })()
            }))
        }
        data.staffs  = data.staffs.map(staff=>
            ({
              id : staff.id ,
              slots : staff.slots.filter(slot=> (slot.timings.length > 0))
            })
        )
        result.push(data);
    }
    return result;
}

/**
 *
 * @param slots the slots intervals created in the frontend
 * @param hours one hour interval created same thing as the requested timings for the staffs
 * @returns A dictionary of key as string and the mapped slots with intervals inside it
 * @desc Maps the slots created with either 15 min interval or 30 min interval to the hours of interval
 * that was given to the staffs as a request
 */
function groupTimings (slots : TSlots[] , hours : string[] ) {
    let result :   { [key : string ] : { hour : string , slots : { time : string , limit : number }[] } }  = {}  ;
    let i : number = 0;
    for(const hr of hours) {
        while(i < slots.length  && isWithinRange(hr , slots[i].time)) {
            // let found = result.find(e=>e.hour === hr);
            if(!result[hr]) {
                result[hr] = {hour : hr , slots : [slots[i]]};
            }
            else {
                result[hr].slots.push(slots[i]);
            }
            i++;
        }
    }
    return result;
}

/**
 * @Desc Generates 1 hour interval of timings as a combined string ,
 * @Example ["08:45 - 09:45", "09:45 - 10:45",]
 */
function  generateHours () : string[]  {
        const resultSlots: string[] = [];
        let startTime: string = '8:45', endTime: string = '16:30';
        let startMinutes: number = timeToMinutes(startTime), endMinutes: number = timeToMinutes(endTime);
        const hour: number = 60;
        while (startMinutes <= endMinutes) {
            let timeInterval: string = `${minutesToTime(startMinutes)} - ${minutesToTime(startMinutes + hour)}`;
            if (timeInterval !== '12:45 - 13:45')
                if (timeInterval === '15:45 - 16:45')
                    resultSlots.push('15:45 - 16:30');
                else
                    resultSlots.push(timeInterval);

            startMinutes += hour;
        }
        return resultSlots;
    }