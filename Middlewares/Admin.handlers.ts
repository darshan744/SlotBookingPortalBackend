import { Request, Response } from 'express';
import { StaffModel } from '../Models/Staff.model';
import { AvailabilityModel } from '../Models/Availability.model';
import { ObjectId } from 'mongoose';
import { transformSlots, reTransformSlots } from './helpers';

export const getSlotAvailability = async (req: Request, res: Response): Promise<void> => {
    let id: ObjectId | null = (await StaffModel.findOne({ staffId: req.params.id }, '_id'));
    if (id === null) {
        res.status(500).json({ message: "Please Enter Correct Data" });
        return;
    }
    try {
        const slots = await AvailabilityModel.findOne({ instructorId: id });
        const transformedSlots: any = transformSlots(slots!.availableSlots);
        res.status(200).json({ slots: transformedSlots, message: 'Successful', id: id });
    } catch (e: any) {
        console.error("error", e.message);
        res.status(500).json({ message: "Error Occurred", error: e.message });
    }
}

export const postAvailability = async (req: Request, res: Response): Promise<void> => {
    let id: ObjectId | null = (await StaffModel.findOne({ staffId: req.params.id }, '_id'))
    const availabilities: any = req.body;
    const reTransformedSlots: any = reTransformSlots(availabilities);
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