import mongoose , {ObjectId} from 'mongoose';
import {Request  , Response }  from 'express';
import { StaffModel } from '../../Models/Staff.model';
import { IGroupDates } from '../type.interfaces';
import { AvailabilityModel } from '../../Models/Availability.model';
import { reTransformSlots } from '../helpers';


/**
 * 
 * @method POST
 * @route api/v1/Admin/postAvailability/:id
 */
export const postAvailability = async (req: Request, res: Response): Promise<void> => {
    let id: ObjectId | null = (await StaffModel.findOne({ staffId: req.params.id }, '_id'))
    const availabilities: any = req.body;
    const reTransformedSlots: IGroupDates[] = reTransformSlots(availabilities);
    try {
        const userAvailability = await AvailabilityModel.findOne({ instructorId: id });
        if (!userAvailability) {
            res.status(404).json({ message: "cannot find user" });
            return;
        }
        reTransformedSlots.forEach((slotObj: { date: string; availableSlots: { time: string; isAvailable: string; }[]; }) => {
            let existingDate = userAvailability.availableSlots.find((e: { date: string; }) => e.date === slotObj.date);
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