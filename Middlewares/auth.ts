import { StudentModel } from "../Models/Student.model";
import { StaffModel } from "../Models/Staff.model";
import { Request, Response } from "express";

async function auth(req :Request , res : Response) {
    let id = req.body.rollNo;
    console.log(id)
    let isStaff , isStudent;
    if(id) {
         isStaff = await StaffModel.findOne({ staffId: id });
         isStudent = await StudentModel.findOne({ studentId: id });
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
    else {
        res.json({message : 'Please Provide Roll Number'})
    }
    
}
export {auth}