import { StudentModel } from './../../Models/Student.model';
import { Request , Response } from "express";
import mongoose from "mongoose";
import { IBookingStatus, IStudent } from "../../Models/interfaces";
import { IStudentMarks } from "../function.interfaces";
import { SlotModel } from '../../Models/Slot.model';
/**
 * @method POST
 * @route  api/v1/Admin/studentMarks/
 * @desc It will handle either one or many students as well
 */

export const studentsMarks = async (req: Request, res: Response): Promise<void> => {
    const { eventType, staffId, studentmarks }:
        { eventType: string, staffId: string, studentmarks: IStudentMarks[] }
        = req.body;
    let studentObjectIds: mongoose.Schema.Types.ObjectId[] = [];
    for (const student of studentmarks) {
        const studentId = student.id;
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); //YYYYMMDDTHHMMSSZ
        const resultId = `${studentId}_${eventType}_${timestamp}`;
        const results = {
            marks: student.marks,
            remarks: student.remarks === "" ? "No Remarks" : student.remarks,
            isPresent: student.ispresent,
            eventType: eventType,
            date: new Date(),
            resultId
        }
        const update: IStudent | null = await StudentModel.findOneAndUpdate({
            studentId: studentId
        }, {
            $push: { "EventHistory": results }
        }, { new: true, returnDocument: 'after', projection: { _id: 1 } })
        if (update) {
            studentObjectIds.push(update._id as mongoose.Schema.Types.ObjectId);
        }
    }
    const bookers: { bookers: IBookingStatus[] } | null = await SlotModel.findOne({ eventType: eventType, "bookers.studentId": { $in: studentObjectIds } },
        { bookers: 1, _id: 0 });
    // console.log(bookers);
    // let objId = new mongoose.Schema.Types.ObjectId("672a46fd1fdb7cc295bd6c59");
    // console.log( studentObjectIds ,studentObjectIds.includes(objId));
    if (bookers) {
        const filteredBookers = (bookers.bookers).filter((booker) =>
            !(studentObjectIds.some(id => id.toString() === booker.studentId.toString())))

        console.log(filteredBookers);
        await SlotModel.findOneAndUpdate({
            eventType: eventType,
            "bookers.studentId": { $in: studentObjectIds }
        },
            { $set: { bookers: filteredBookers } },
            { new: true, returnDocument: 'after' }
        )
    }
    res.json({ message: "nice", studentmarks });
}