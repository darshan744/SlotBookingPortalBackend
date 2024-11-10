import { Response, Request } from "express";
import { SlotModel } from "../Models/Slot.model";
import { ISlot } from "../Models/interfaces";

export const slots = async (req: Request, res: Response): Promise<void> => {
    console.log("Request Received ")
    const event = req.params.eventType;
    let slotsData: Pick<ISlot,"slots" | "startDate" | "endDate">[];
    /*When trying to select  data from the database,
     either we should write for excluding all fields or including fields not both in same  query*/
    if(event === 'Mi' || event === 'Si' || event === 'Gd') {
        slotsData = await SlotModel.find(
            {
                eventType: event === 'Mi' ? 'Mock Interview'
                    : event === 'Si' ? 'Self Introduction' : 'Group Discussion'
            })
            .select({
                'slots._id': 0, 
                'year': 0,
                'bookers':0, 
                'eventType': 0, 
                '_id': 0 
            }).exec();
            if(slotsData.length !== 0) {
                res.json({ success :true , message: "Slot Retrieved Successfully", data: slotsData[0] });
            }
            else {
                res.json({success : true , message : "Currently Slot is Empty" })
            }
    }
    else {
        res.status(404).json({succes : false , message : "The Requested Event is not Avaialbile "})
    }
}