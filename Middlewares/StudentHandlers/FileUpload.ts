import { Request, Response } from "express";
import { StudentModel } from "../../Models/Student.model";
import { IStudent } from "../../Models/interfaces";
import { IFileUploadError, IFileUploadSuccess } from "../Responses.interfaces";

/**
 * @mehtod POST
 * @route api/v1/students
 * @param req file
 * @param res 
 * @returns 
 */

export async function fileUpload(req: Request, res: Response) {
    if (!req.file) {
        res.status(400).json({ message: "No file Found", success: false });
        return
    }
    try {
        const fileName = req.file.filename;
        const id = req.session.user.id;
        const cursor: IStudent | null = await StudentModel.findOne({ id: id });

        if (!cursor) {
            res.status(404).json({ message: "Can't Register the file name to User", success: false })
            return;
        }
        cursor.resume = fileName;
        await cursor.save();
        const responseObject: IFileUploadSuccess = { 
            success: true, 
            message: "File uploaded SuccessFully", 
            fileName: req.file.filename 
        }
        res.status(200).json(responseObject)
    } catch (error: any) {
        const errorResponse: IFileUploadError = { 
                    success: false, 
                    message: 'Error Occurred While Uploading The file',
                    error: error.message }
        res.status(500).json(errorResponse);
    }

}