import { StudentModel } from './../../Models/Student.model';
import { Request , Response } from "express";
import mongoose from "mongoose";
import { IStudent } from "../../Models/interfaces";
import { IStudentMarks } from "../function.interfaces";
import { SlotModel } from '../../Models/Slot.model';
/**
 * @method POST
 * @route  api/v1/Admin/studentMarks/
 * @desc It will handle either one or many students as well
 */

export const studentsMarks = async (req: Request, res: Response): Promise<void> => {
    const slotId = req.query.slotId;
    console.log("SlotID" , slotId);
    const { eventType, staffId, studentmarks }:{ eventType: string, staffId: string, studentmarks: IStudentMarks[] }
        = req.body;
    let studentObjectIds: string[] = [];
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
            id: studentId
        }, {
            $push: { "EventHistory": results }
        }, { new: true, returnDocument: 'after', projection: { _id: 1 } })
        console.log(update);
        if (update) {
            studentObjectIds.push((update._id as mongoose.Schema.Types.ObjectId).toString());
        }
    }

    let bookers = await SlotModel.findOne({ slotId },{ bookers: 1, });
        /** To Use .save() method the _id must be present or else _id Not Found In document not found error will be thrown */
        console.log("Bookers" , bookers);
        if (bookers) {
        // bookers.bookers = (bookers.bookers).filter((booker) =>
        //     !(studentObjectIds.some(id => id.toString() === booker.studentId.toString())));
        console.log("Student Obj ids" , studentObjectIds);
        bookers.bookers.forEach(e=> {
            if(studentObjectIds.includes(e.studentId.toString())){
                e.slotFinished = true;
                console.log(e);
            }
        })
        await bookers.save()
    }
    res.json({ message: "nice", studentmarks : bookers?.bookers });
}