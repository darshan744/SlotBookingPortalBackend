import { StudentModel } from "../Models/Student.model";
import { StaffModel } from "../Models/Staff.model";
import { Request, Response } from "express";

async function auth(req :Request , res : Response) {
    const id = req.body.rollNo;

    const isStaff = await StaffModel.findOne({ staffId: id });
    const isStudent = await StudentModel.findOne({ _id: id });
    if (isStaff) {
        console.log('isStaff');
        res.status(200).json({ role: 'staff', user: isStaff });
    }
    else if (isStudent) {
        console.log('isStudent');

        res.status(200).json({ role: 'student', user: isStudent });
    }
    else {
        console.log('NOT A USER')
        res.status(404).json({ message: 'User Not Found' });
    }
}
export {auth}