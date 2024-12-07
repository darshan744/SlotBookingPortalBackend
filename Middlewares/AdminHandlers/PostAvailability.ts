
import {Request  , Response }  from 'express';
import { IGroupDates } from '../type.interfaces';
import { AvailabilityModel } from '../../Models/Availability.model';
import { reTransformSlots } from '../../Utils/RetransformSlots.utils';



/**
 * 
 * @method POST
 * @route api/v1/Admin/postAvailability/:id
 */
export const postAvailability = async (req: Request, res: Response): Promise<void> => {


    let id = req.session.user.objectId
    const availabilities: any = req.body;
    const reTransformedSlots: IGroupDates[] = reTransformSlots(availabilities);
    try {
        const userAvailability = await AvailabilityModel.findOne({ instructorId: id , responseDeadline : {$gte : ["$responseDeadline" , new Date()]}});
        if (!userAvailability) {
            res.status(404).json({ message: "cannot find user" });
            return;
        }
        reTransformedSlots.forEach((slotObj: { date: Date; availableSlots: { time: string; isAvailable: string; }[]; }) => {
            let existingDate = userAvailability.availableSlots.find((e: { date: Date; }) => e.date === slotObj.date);
            if (existingDate) {
                existingDate.slots.forEach((slot: { time: string; isAvailable: string; }) => {
                    let receivedSlotUpdate = slotObj.availableSlots.find((s: { time: string; }) => s.time === slot.time);
                    if (receivedSlotUpdate) {
                        slot.isAvailable = receivedSlotUpdate.isAvailable;
                    }
                });
            }
        });
        await userAvailability.save();
        res.json({ message: "Success", slots: userAvailability });
    } catch (e: any) {
        console.log(e);
        res.status(500).json({ message: e + " error occurred" });
    }
}