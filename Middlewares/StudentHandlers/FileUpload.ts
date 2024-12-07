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
    console.log(req.file);
    if (!req.file) {
        res.status(400).json({ message: "No file Found", success: false });
        return
    }
    try {
        console.log("File Uploading");
        const fileName = req.file.filename;
        const id = req.session.user.id;
        console.log(id);
        const cursor: IStudent | null = await StudentModel.findOne({ id: id });
        console.log('response');
        console.log(cursor);
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
        console.log(error.message);
        const errorResponse: IFileUploadError = { 
                    success: false, 
                    message: 'Error Occured While Uploading The file',
                    error: error.message }
        res.status(500).json(errorResponse);
    }

}