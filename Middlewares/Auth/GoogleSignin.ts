import { Request, Response } from "express";
import { StudentModel } from "../../Models/Student.model";
import { IStaff, IStudent, IUser } from "../../Models/interfaces";
import mongoose from "mongoose";
import { ResponseMessages, Role } from "../../../Shared/Authenticate.enum";

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
    try {
        const user: IStudent | null | IStaff = await UserModel.findOne({
            email: credentials.email,
        });
        if (user) {
            req.session.user = {
                objectId: (user._id as mongoose.Types.ObjectId).toString(),
                id: user.id,
                name: user.name,
                role: user.userType,
            };
            let data :any = {
                id: user.id,
                name: user.name,
                email: user.email,
                department: user.department,
            };
            if('year' in user) {
                data.year = user.year
            }
            res.json({data , success:true, role : user.userType});
        } else {
            res.json({ success: false, message: ResponseMessages.USER_NOT_FOUND });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
