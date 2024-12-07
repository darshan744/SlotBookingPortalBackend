import { Request , Response } from "express";
import { SlotModel } from "../../Models/Slot.model";
import { IBookingStatus } from "../../Models/interfaces";

import { ObjectId } from "mongoose";
import { UserModel } from "../../Models/User.model";
import { venueMatch } from "../../Utils/VenueMatch.utils";

/** 
 * @method GET
 * @route api/v1/Admin/student/:id
 * 
 */
export const getStudents = async (req: Request, res: Response): Promise<void> => {
    let hour = new Date().getHours();
    let staffId = req.params.id;
    console.log(staffId);
    if (!staffId) {
        res.status(404).json({ success: false, message: "Please Enter Correct Data" });
        return
    }
    const agg = [
        {
            $unwind: "$slots",
        },
        {
            $match: {
                "slots.staffs": staffId,
            },
        },
        {
            $project: {
                eventType: 1,
                slots: 1,
                bookers: 1,
                _id: 0,
            },
        },
    ];
    let data
    try {
        data = await SlotModel.aggregate(agg);
        if (data.length === 0) {
            res.json({ message: "No Data Found" });
            return;
        }
        let staffVenue = data[0].slots.venue;
        let nowBookers: Pick<IBookingStatus, "bookingDate" | "bookingTime" | "studentId">[] = [];
        data[0].bookers.forEach((slot: { bookingDate: Date, bookingTime: string, studentId: ObjectId, isBooked: boolean }) => 
        {
            if (slot.isBooked && slot.bookingTime !== null && venueMatch(slot.bookingTime, staffVenue)) {
                let d: { bookingTime: string, bookingDate: Date, studentId: ObjectId } = {
                    bookingTime: slot.bookingTime.split("|")[1].toString(),
                    bookingDate: slot.bookingDate,
                    studentId: slot.studentId
                }
                nowBookers.push(d);
            }
        });

      /**
        * nowBookers = nowBookers.filter(e=> {
        * return (e.bookingTime?.split("-")[0].trim().split(":").map(Number)[0] === hour);
        *  });
        * **uncomment to get the current hour bookers**
        */
        const students = await UserModel.find({ _id: { $in: nowBookers.map(e => e.studentId) } }, { _id: 0, password: 0 })
        res.json({ students, eventType: data[0].eventType });


    } catch (error) {

        res.status(500).json({ message: "Error Occurred" });
    }



}