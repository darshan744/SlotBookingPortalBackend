import mongoose from 'mongoose';
import { Request , Response } from 'express';
import { StudentModel } from '../../Models/Student.model';

interface IIdentity {
    identifier : string
}

/**
 * @method GET 
 * @route api/v1/Admin/information/students?identifier
 * @param req 
 * @param res 
 * @returns Array of students if used Name or Array with single element if used Id
 */
export async function findStudent(req : Request , res : Response){
    const body  = req.query.identifier;
    if(!body) {
         res.status(404).json({message : "not found" , success:false})
         return;
    }
    try {

        const student = await StudentModel.find(
        {
            $or : [{name : body} , {id : body}]
        },
        {password:0 , _id:0 , __v:0 , createdAt:0,updatedAt:0}
    );

        student ? res.json({data :student , message : "Students Found" , success:true}) 
                : res.json({message : "Student not Found" , success:false});
    } catch (error : any) {
        res.status(500).json({message:"Error Occurred"});
    }
    
}
