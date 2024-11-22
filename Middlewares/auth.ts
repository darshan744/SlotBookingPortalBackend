import mongoose from "mongoose";
import { StudentModel } from "../Models/Student.model";
import { StaffModel } from "../Models/Staff.model";
import { Request, Response } from "express";
import { IStaff, IStudent } from "../Models/interfaces";

enum ResponseMessages {
    INVALID_PASSWORD = 'Invalid Password',
    USER_NOT_FOUND = 'User not found',
}
enum Role {
    STUDENT = 'student',
    STAFF = 'staff',
    ADMIN =  'admin'
}
// Augmenting the express-session module to include user information in the session

const toObjType = (obj: any) => obj as mongoose.Schema.Types.ObjectId;
/**
 * @route POST - /api/v1/login
 * @param req  - contains the user pass and id
 * @param res  - sends the response to the user
 */
export const authenticate = async (req: Request, res: Response) => {
    const credentials = req.body.user;
    let student: IStudent | null = await StudentModel.findOne({ studentId: credentials.name });
    let staff: IStaff | null = await StaffModel.findOne({ staffId: credentials.id });
    console.log("login", credentials);
    if (student) {
        if (student.password === credentials.password) {
            req.session.user = {
                objectId: toObjType(student._id).toString(),
                id: student.studentId,
                name: student.name
            }
            console.log("Login");
            console.log(req.session, req.session.id);
            let data = {
                studentId: student.studentId, name: student.name,
                email: student.email, department: student.department,
                year: student.year
            }
            res.json({ data, role: Role.STUDENT, success:true })
        }
        else {
            res.status(401).json({
                success: false,
                message: ResponseMessages.INVALID_PASSWORD
            })
        }
    }
    else if (staff) {
        if (staff.password === credentials.password) {
            req.session.user = {
                objectId: toObjType(staff._id).toString(),
                id: staff.staffId,
                name: staff.name
            }
            let data = {
                staffId: staff.staffId, name: staff.name,
                email: staff.email
            }
            res.json({ success: true,data, role: Role.STAFF })
        }
        else {
            res.json({ succes: false, message: ResponseMessages.INVALID_PASSWORD })
        }
    }
    else {
        res.json({success : false, message: ResponseMessages.USER_NOT_FOUND})
    }
}



/**
 * Handles Google login for both students and staff.
 * @route POST - /api/v1/google/login
 * @param {Request} req - The request object containing user credential.
 * @param {Response} res - The response object to send the result.
 */
export const googleLogin = async (req: Request, res: Response) => {
    const user = req.body.user;
    const student: IStudent | null = await StudentModel.findOne({ email: user.email }, { password: 0 });
    if (student) {
        req.session.user = {
            objectId: (student._id as mongoose.Types.ObjectId).toString(),
            id: student.studentId,
            name: student.name
        }
        console.log("Session", req.session.id);
        let data = {
            studentId: student.studentId, name: student.name,
            email: student.email, department: student.department,
            year: student.year
        }
        res.json({ success: true,  data, role: 'student' })
        console.log(req.session, req.session.id);
    } else {
        const staff: IStaff | null = await StaffModel.findOne({ email: user.email }, { password: 0 });
        if (staff) {
            req.session.user = {
                objectId: toObjType(staff._id).toString(),
                id: staff.staffId,
                name: staff.name
            }
            console.log("Session", req.session);
            let data = {
                staffId: staff.staffId, name: staff.name,
                email: staff.email
            }
            res.json({ success: true, data, role: 'staff' })
        }
        else {
            res.json({ success: false, message: 'User not found' })
        }
    }
}
