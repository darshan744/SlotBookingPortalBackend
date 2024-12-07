import { Request , Response } from "express";
import { eventModel } from "../../Models/Event.model";

export async function Events (req : Request, res : Response) {
    try {
     const events =  await eventModel.find({},{Name:1 , _id:0});
     if(events) {
       res.json({ message : 'Successfull' ,data:events})
     }
     else {
       res.json({message:"No events FOund"})
     }
    }
    catch(e) {
     res.json({Message: " Error Occured"})
    }
   }