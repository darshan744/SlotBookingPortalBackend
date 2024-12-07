import { Request , Response } from "express";
import fs from 'fs'
import path from 'path';
export async function fileDelete (req : Request , res : Response) {
     const fileName = req.query.fileName;
     console.log('route file delete');
     console.log(fileName);
     try {
         const fileDir = path.join(__dirname , '../../public' , fileName as string)
         console.log(fileDir);
         fs.rmSync(fileDir);
         res.json({message : 'ok'});
     } catch (e : any) {
        console.log(e.message)
        res.json({error : e.message , success: false , message : "failed to delete file"})
     }  
}