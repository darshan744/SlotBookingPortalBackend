import { Request , Response } from "express";
import { StudentModel } from "../../Models/Student.model";
export async function getAllStudents (req : Request , res : Response) {
    try {
        const studentCursor = await StudentModel.find({} , {_id:0 , EventHistory : 0}).lean();
        res.json({success:true , message : 'Students Retrieved' , data : studentCursor});
    } catch (error) {
        res.json({success:false , message : 'Error Occurred in Server Try Again after Some Time'})
    }
}