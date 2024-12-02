import { Request, Response } from "express";
import { StudentModel } from "../../Models/Student.model";
import { IStaff, IStudent, IUser } from "../../Models/interfaces";
import mongoose from "mongoose";
import { Role } from "../../../Shared/Authenticate.enum";
import { StaffModel } from "../../Models/Staff.model";
import { toObjType } from "../helpers";
import { UserModel } from "../../Models/User.model";

/**
 * Handles Google login for both students and staff.
 * @method POST
 * @route  /api/v1/google/login
 * @param {Request} req - The request object containing user credential.
 * @param {Response} res - The response object to send the result.
 */
export const googleLogin = async (req: Request, res: Response) => {
    const credentials = req.body.user;
    const student: IStudent | null = await StudentModel.findOne({ email: credentials.email }, { password: 0 });
    // const user : IUser | null = await UserModel.findOne({email : credentials.email} , {password:0 , _id : 0 });
    // if(user) {
    //     req.session.user = {
    //         objectId : user.objectId.toString(),
    //         id:user.id,
    //         role : user.role
    //     }
    // }
    // else {
    //     res.json({success: , message : "User Not Found"})
    // }
    if (student) {
        req.session.user = {
            objectId: (student._id as mongoose.Types.ObjectId).toString(),
            id: student.studentId,
            name: student.name,
            role: Role.STUDENT
        }
        req.session.save()
        console.log("Session", req.session.id);
        let data = {
            studentId: student.studentId, name: student.name,
            email: student.email, department: student.department,
            year: student.year
        }
        res.json({ success: true,  data, role: 'student' })
        console.log(req.session, req.session.id);
    } else {
        const staff: IStaff | null = await StaffModel.findOne({ email: credentials.email }, { password: 0 });
        if (staff) {
            req.session.user = {
                objectId: toObjType(staff._id).toString(),
                id: staff.staffId,
                name: staff.name,
                role:Role.STAFF
            }
            req.session.save()
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