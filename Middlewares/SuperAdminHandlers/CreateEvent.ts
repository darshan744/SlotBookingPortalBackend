import { EventModel } from "../../Models/Settings.model";
import { IEvents } from "../../Models/interfaces";
import { Request , Response } from "express";

export const createEvent = async (req : Request , res : Response) => {
    const eventDetails : IEvents = req.body;
    console.log(req.body);

    eventDetails.Name = eventDetails.Name.trimEnd();
    if(!eventDetails) {
        res.json({message : "No info Found" , success:false});
        return;
    }
    try {
        const result = await EventModel.create(eventDetails,{new : true})
        res.status(200).json({ message : "Done updating"  , success:true })
    } catch (error : any) {
        console.log(error.message);
        res.json({success:false , err : error.message , message:"Failed To Insert Event"});
    }

}