import { ObjectId } from "mongoose";
import { Request , Response } from "express";
import { StudentModel } from "../../Models/Student.model";
import { IBookingStatus } from "../../Models/interfaces";
import { SlotModel } from "../../Models/Slot.model";

/**
 * @for Creating The slots in the Database
 */
export const postSlots = async (req: Request, res: Response): Promise<void> => {
    let data: any = req.body;
    const students: Array<{ _id: ObjectId }> = await StudentModel.find(
      { year: req.body.year },
      "_id"
    );
    const ids: ObjectId[] = students.map((e) => e._id);
    let bookers: Array<IBookingStatus> = ids.map((e) =>  ({
      studentId: e,
      isBooked: false,
      bookingDate: null,
      bookingTime: null,
    }));
    data.bookers = bookers;
    data.slotId = `${(data.startDate).split("T")[0]}_${data.endDate.split("T")[0]}_${data.eventType}`
    try {
      await SlotModel.insertMany(data);
      res.json({ success: true });
    } catch (e: any) {
      console.error(e.message, typeof e);
      res.json({ message: "Error Occurred in inserting Slots", success: false });
    }
  };
  