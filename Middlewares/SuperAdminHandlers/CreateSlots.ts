import { ObjectId } from "mongoose";
import { Request , Response } from "express";
import { StudentModel } from "../../Models/Student.model";
import { IBookingStatus , IVenues2} from "../../Models/interfaces";
import { AvailabilityModel } from "../../Models/Availability.model";
import { TAvailability } from './SuperAdmin.interface'
import { StaffModel } from "../../Models/Staff.model";
import { ISlotRequest } from '../function.interfaces'
import { mapTimings } from '../../Utils/TimeManipulation'
import {SlotModel} from "../../Models/Slot.model";

type TId = {_id:ObjectId , id : string};
type TSlotResponses = TAvailability['availableSlots'][0]['slots'][0];
type TAvailableSlots = TAvailability['availableSlots'][0]
type TAcceptedResponse = Pick<TAvailability, "availableSlots" | "instructorId"> & {id : string}
/**
 * @for Creating The slots in the Database
 */
export const postSlots = async (req: Request, res: Response): Promise<void> => {
    let data: any = req.body;
   res.json({message:"good"});
    // const students: Array<{ _id: ObjectId }> = await StudentModel.find(
    //   { year: req.body.year },
    //   "_id"
    // );
    // const ids: ObjectId[] = students.map((e) => e._id);
    // let bookers: Array<IBookingStatus> = ids.map((e) =>  ({
    //   studentId: e,
    //   isBooked: false,
    //   bookingDate: null,
    //   bookingTime: null,
    // }));
    // data.bookers = bookers;
    // data.slotId = `${(data.startDate).split("T")[0]}_${data.endDate.split("T")[0]}_${data.eventType}`
    // try {
    //   await SlotModel.insertMany(data);
    //   res.json({ success: true });
    // } catch (e: any) {
    //   console.error(e.message, typeof e);
    //   res.json({ message: "Error Occurred in inserting Slots", success: false });
    // }
}

export const postSlots2 = async (req: Request, res: Response): Promise<void> => {
    let data : ISlotRequest = req.body;
    const students : Array<{_id: ObjectId}> = await StudentModel.find(
        {year : data.year} , {_id:1});
    let studentObjectIds = students.map(e=>e._id);
    const bookers : Array<IBookingStatus>  = studentObjectIds.map(e=>({
        studentId:e,
        isBooked:false,
        bookingDate:null,
        bookingTime:null,
        })
    );
    let staffAvailabilityCursor     = (await AvailabilityModel.find(
        // {responseDeadline:{$gte : '2024-12-20T12:38:23.849+00:00'}},
        {unmodifiedCount:0},
        {availableSlots:1 ,instructorId:1 ,  _id:0}
    ));
    let staffIds = data.venuesAndStaffs.map(e=>
        (e.staffs)).flat();//flat() converts 2d Array to 1d Array
    console.log(staffIds);
    /**
     * We have the instructor id as objectId and the id as the string id
     * so to compare and  retrieve the corresponding response of the staff we get
     * the object id of the staff using $in operator which is similar as .includes
     */
    let staffsObjectId: TId[] = await StaffModel.find(
        {id : {"$in" : staffIds}} ,
        {_id:1 , id:1 , userType:0 }
    )
    /**
     * @desc filtering out only the accepted timing to create the slot with their corresponding timings
     *   and its corresponding instructors id (ObjectID)
     */
    let staffAcceptedResponse : TAcceptedResponse[]  = staffAvailabilityCursor.map(e=>
        ({
            instructorId: e.instructorId,
            id : staffsObjectId.find(el=>el._id.toString() === e.instructorId.toString())?.id??'',
            availableSlots : e.availableSlots.map(
                (el: TAvailableSlots): TAvailableSlots =>
                    ({
                        date: el.date,
                        slots: el.slots.filter(
                            (slot: TSlotResponses): boolean =>
                                slot.isAvailable === 'Accepted')
                    })
            )
        })
    );
    /**
     * @desc id for the slot with containing startDate_endDate_eventType
     * @example = 2024-12-25_2024-12-30_Mock Interview
     */
    const slotID = `${(data.startDate).split("T")[0]}_${data.endDate.split("T")[0]}_${data.eventType}`;
    let venues =  mapTimings(data.venuesAndStaffs , data.slots ,staffAcceptedResponse)
    const slots = new Slot(slotID , data.startDate , data.endDate , data.eventType , data.year , venues , bookers );

    await SlotModel.create(slots);
    res.json({ slots })
}
class Slot {
    slotId: string;
    startDate: Date;
    endDate: Date;
    eventType: string;
    year: string;
    slots: IVenues2[]; // List of venues with accepted slots
    bookers: IBookingStatus[]; // List of booking statuses for each student

    constructor(
        slotId: string,
        startDate: string,
        endDate: string,
        eventType: string,
        year: string,
        slots: IVenues2[],
        bookers: IBookingStatus[]
    ) {
        this.slotId = slotId;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.eventType = eventType;
        this.year = year;
        this.slots = slots;
        this.bookers = bookers;
    }
}
