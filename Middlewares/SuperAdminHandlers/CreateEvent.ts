import { eventModel } from "../../Models/Event.model";
import { IEvents } from "../type.interfaces";
import { Request , Response } from "express";
export const createEvent = async (req : Request , res : Response) => {
    const eventDetails : IEvents = req.body;
    eventDetails.Name = eventDetails.Name.trimEnd();
    console.log("Events Route");
    if(!eventDetails) {
        res.json({message : "No info Found" , success:false});  
        return;
    }    
    try {
        const result = await eventModel.insertMany(eventDetails);
        res.status(200).json({message : "Done updating"  , success:true})
    } catch (error : any) {
        console.log(error.message);
        res.json({succes:false , message:"UpdationFailed"});
    }
}