import { transformSlots } from './../../Utils/TransformSlots.utils';
import { ISlotTimings } from './../type.interfaces';
import {ObjectId} from 'mongoose';
import {Request  , Response }  from 'express';
import { AvailabilityModel } from '../../Models/Availability.model';

import { IAvailability } from '../../Models/interfaces';

/**
 * 
 * @method GET
 * @route  api/v1/Admin/getAvaialability/:id
 * 
 */
export const getSlotAvailability = async (req: Request, res: Response): Promise<void> => {
    let id: ObjectId | string | null = req.session.user.objectId ?? null;
    if (id === null) {
        res.json({ message: "Please Enter Correct Data" });
        return;
    }
    try {
        const slots : IAvailability | null = await AvailabilityModel.findOne({ instructorId: id ,
            responseDeadline : {$gte : ["$responseDeadline" , new Date()]}
         });
        
        if (slots) {
            const transformedSlots: ISlotTimings[] = transformSlots(slots.availableSlots);
            res.status(200).json({ slots: transformedSlots, message: 'Slots Found', id: id , responseDeadline : slots.responseDeadline });
            console.log(transformedSlots);
            return;
        }
        else {
            res.status(200).json({ message: "No Slots Request For You Found" });
        }
    } catch (e: any) {
        console.error("error", e.message);
        res.status(500).json({ message: "Error Occurred", error: e.message });
    }
}