import {Request , Response } from 'express';
import {BreaksModel} from "../../Models/Settings.model";
import {IBreaks} from "../../Models/interfaces";

export async function postBreaks (req: Request, res: Response): Promise<void> {
    const body : IBreaks = req.body;
    if(!body) {
        res.json({success : false , error: "Body Not Found"});
        return;
    }
   
    try {
        const responseCursor = await BreaksModel.create(body);
        res.json({success : true ,message: 'Successfully Created'});
    }catch (e:any) {
        res.status(400).json({message : e.message , success : false});
    }
}
export async function getBreaks (req: Request, res: Response): Promise<void> {
    try{
        const configId = req.query.configurationID;
        if(configId){
            const breakCursor = await BreaksModel.findOne(
                {configurationId : configId} ,
                {_id : 0 , configurationId : 1 , breaks : 1}
            );
            if(!breakCursor){
                res.json({success : false , error : "Breaks not found"});
                return;
            }
            res.json({success: true , message : "Found" , data : breakCursor})
            return;
        }
        const breaks = await BreaksModel.find({},{_id:0});
        res.json({success:true , message:"Successfully" , data : breaks})
    }
    catch(err){
        res.json({ success:false , error: "Breaks Not Found"});
    }
}
