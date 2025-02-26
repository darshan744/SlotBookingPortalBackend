import { Request , Response } from "express";
import fs from 'fs'
import path from 'path';
import { StudentModel } from "../../Models/Student.model";
import { IStudent } from "../../Models/interfaces";
/**
 * @Route - /api/v1/Students/upload
 */
export async function fileDelete (req : Request , res : Response) {
     const fileName = req.query.fileName;
     try {
         const fileDir = path.join(__dirname , '../../public' , fileName as string)
         const exist : boolean = fs.existsSync(fileDir);
         if(!exist) {
            res.status(404).json({message : "File doesn't exist"});
            return;
         }
         fs.rmSync(fileDir);
         const id = req.session.user.id;
         const user = await StudentModel.findOne({id}).lean<IStudent>();
         if(!user) {
             res.status(404).json({message : "User not found"});
             return;
         }
         user.resume = '';
         await user.save();
         res.json({message : 'ok'});
     } catch (e : any) {
        res.json({error : e.message , success: false , message : "failed to delete file"})
     }  
}