import { Request , Response } from "express";
import { EventModel } from "../../Models/Settings.model";

export async function Events (req : Request, res : Response) {
    try {
     const events =  await EventModel.find({},{Name:1 , _id:0 , settingType : 0});
     if(events) {
       res.json({ message : 'Successfully' ,data:events})
     }
     else {
       res.json({message:"No events Found"})
     }
    }
    catch(e) {
     res.json({Message: " Error Occurred"})
    }
}