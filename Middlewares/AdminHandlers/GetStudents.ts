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
    const staffId = req.session.user.id
    try{
        const cursor = await SlotModel.findOne({"slots.staffs.id" : staffId} , {bookers : 1, _id : 0 , eventType : 1}).lean();
        if(!cursor || !cursor.bookers) {
            res.json({message : "Nothing found" , student:null});
            return;
        }
        const filteredCursor = cursor.bookers.filter(c => (c.bookingTime !== null && !c.slotFinished && c.bookingTime.split('/')[2] === staffId));
        const students = await UserModel.find({ _id: { $in: filteredCursor.map(e => e.studentId) } }, 
        { _id: 0, id : 1 , name : 1  })
        res.json({success : true , message : "Slot Students Found" , students , eventType : cursor.eventType });
    } catch (error) {

        res.status(500).json({ message: "Error Occurred" });
    }



}