import { Request, Response } from "express";
import { StudentModel } from "../../Models/Student.model";
import { StaffModel } from "../../Models/Staff.model";
import { IStudent } from "../../Models/interfaces";
import { toObjType } from "../helpers";
import { ResponseMessages, Role } from "../../../Shared/Authenticate.enum";



/**
 * @method POST
 * @route   /api/v1/login
 * @param req  - contains the user pass and id
 * @param res  - sends the response to the user
 */
export const authenticate = async (req: Request, res: Response) => {
    const credentials = req.body.user;
    let student: IStudent | null = await StudentModel.findOne({ studentId: credentials.name });
    let staff: any= await StaffModel.findOne({ staffId: credentials.name });
    console.log("staff", staff);
    if (student) {
        if (student.password === credentials.password) {
            req.session.user = {
                objectId: toObjType(student._id).toString(),
                id: student.studentId,
                name: student.name,
                role:Role.STUDENT

            }
            req.session.save()
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
        console.log(staff.password)
        if (staff.password === credentials.password) {

            req.session.user = {
                objectId: toObjType(staff._id).toString(),
                id: staff.staffId,
                name: staff.name,
                role: Role.STAFF
            }
            req.session.save()
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
