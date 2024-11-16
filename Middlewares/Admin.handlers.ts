import { StudentModel } from './../Models/Student.model';
import mongoose, { ObjectId } from 'mongoose';
import { Request, Response } from 'express';
import { StaffModel } from '../Models/Staff.model';
import { AvailabilityModel } from '../Models/Availability.model';
import { transformSlots, reTransformSlots, venueMatch } from './helpers';
import { SlotModel } from '../Models/Slot.model'
import { IBookingStatus, IStudent } from '../Models/interfaces';
import { IStudentEventResult } from "../Models/interfaces";

export const getSlotAvailability = async (req: Request, res: Response): Promise<void> => {
    let id: ObjectId | null = (await StaffModel.findOne({ staffId: req.params.id }, '_id'));
    if (id === null) {
        res.status(500).json({ message: "Please Enter Correct Data" });
        return;
    }
    try {
        const slots = await AvailabilityModel.findOne({ instructorId: id });
        const transformedSlots: any = transformSlots(slots!.availableSlots);
        res.status(200).json({ slots: transformedSlots, message: 'Successful', id: id });
    } catch (e: any) {
        console.error("error", e.message);
        res.status(500).json({ message: "Error Occurred", error: e.message });
    }
}

export const postAvailability = async (req: Request, res: Response): Promise<void> => {
    let id: ObjectId | null = (await StaffModel.findOne({ staffId: req.params.id }, '_id'))
    const availabilities: any = req.body;
    const reTransformedSlots: any = reTransformSlots(availabilities);
    try {
        const userAvailability = await AvailabilityModel.findOne({ instructorId: id });
        if (!userAvailability) {
            res.status(404).json({ message: "cannot find user" });
            return;
        }
        reTransformedSlots.forEach((slotObj: { date: string; availableSlots: { time: string; isAvailable: string; }[]; }) => {
            let existingDate = userAvailability.availableSlots.find((e: { date: string; }) => e.date === slotObj.date);
            if (existingDate) {
                existingDate.slots.forEach((slot: { time: string; isAvailable: string; }) => {
                    let receivedSlotUpdate = slotObj.availableSlots.find((s: { time: string; }) => s.time === slot.time);
                    if (receivedSlotUpdate) {
                        slot.isAvailable = receivedSlotUpdate.isAvailable;
                    }
                });
            }
        });
        await userAvailability.save();
        res.json({ message: "Success", slots: userAvailability });
    } catch (e: any) {
        console.log(e);
        res.status(500).json({ message: e + " error occurred" });
    }
}

export const getStudents = async (req: Request, res: Response): Promise<void> => {
    let hour = new Date().getHours();
    let staffId = req.params.id;
    console.log(staffId);
    if (!staffId) {
        res.status(404).json({ success: false, message: "Please Enter Correct Data" });
        return
    }
    const agg = [
        {
            $unwind: "$slots",
        },
        {
            $match: {
                "slots.staffs": staffId,
            },
        },
        {
            $project: {
                eventType: 1,
                slots: 1,
                bookers: 1,
                _id: 0,
            },
        },
    ];
    let data = await SlotModel.aggregate(agg);
    let staffVenue = data[0].slots.venue;
    let nowBookers: Pick<IBookingStatus, "bookingDate" | "bookingTime" | "studentId">[] = [];
    data[0].bookers.forEach((slot: { bookingDate: Date, bookingTime: string, studentId: mongoose.Schema.Types.ObjectId, isBooked: boolean }) => {
        if (slot.isBooked && slot.bookingTime !== null && venueMatch(slot.bookingTime, staffVenue)) {
            let d: { bookingTime: string, bookingDate: Date, studentId: mongoose.Schema.Types.ObjectId } = {
                bookingTime: slot.bookingTime.split("|")[1].toString(),
                bookingDate: slot.bookingDate,
                studentId: slot.studentId
            }
            nowBookers.push(d);
        }
    });
    /**
    * ```js
    * nowBookers = nowBookers.filter(e=> {
      return (e.bookingTime?.split("-")[0].trim().split(":").map(Number)[0] === hour);
       });
     * ```
    * **uncomment to get the current hour bookers**
    *
    */
    const students = await StudentModel.find({ _id: { $in: nowBookers.map(e => e.studentId) } }, { _id: 0, password: 0 })
    res.json({ students, eventType: data[0].eventType });
}
/**
 *
 * @route - api/v1/Admin/studentMarks/:id
 *
 */
interface IStudentMarks {
    id: string, name: string, attendance: string,
    ispresent: boolean, marks: number, remarks: string
}
export const studentsMarks = async (req: Request, res: Response): Promise<void> => {
    const { eventType, staffId, studentmarks }:
        { eventType: string, staffId: string, studentmarks: IStudentMarks[] }
        = req.body;
    let studentObjectIds : mongoose.Schema.Types.ObjectId[] = [];
    for (const student of studentmarks) {
        const studentId = student.id;
        const results = {
            marks : student.marks,
            remarks : student.remarks === "" ? "No Remarks" : student.remarks,
            isPresent : student.ispresent,
            eventType : eventType,
            date : new Date(),
        }
        const update : IStudent | null = await StudentModel.findOneAndUpdate({studentId : studentId},{
            $push:{ "EventHistory" : results}
        },{ new: true, returnDocument: 'after', projection: { _id : 1 } })
        if(update){
            studentObjectIds.push(update._id as mongoose.Schema.Types.ObjectId);
        }
    }
    const bookers : {bookers : IBookingStatus[] }  | null = await SlotModel.findOne({eventType : eventType , "bookers.studentId" : { $in : studentObjectIds}},
        {bookers : 1, _id: 0});
    // console.log(bookers);
    // let objId = new mongoose.Schema.Types.ObjectId("672a46fd1fdb7cc295bd6c59");
    // console.log( studentObjectIds ,studentObjectIds.includes(objId));
    if(bookers) {
        const filteredBookers = (bookers.bookers).filter((booker)=>
            !(studentObjectIds.some(id=>id.toString() === booker.studentId.toString())))
        
        console.log(filteredBookers);
        await SlotModel.findOneAndUpdate({eventType : eventType ,
            "bookers.studentId" : { $in : studentObjectIds}},
            {$set : {bookers : filteredBookers}},
            {new : true, returnDocument : 'after'}
        )
    }
    res.json({ message: "nice",  studentmarks });
}
/**
 *
 * @route - api/v1/Admin/studentMarks
 *
 */
export const student = async (req: Request, res: Response): Promise<void> => {

}