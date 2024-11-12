import { start } from 'repl';
import { Request, Response, NextFunction } from "express";
import { StaffModel } from "../Models/Staff.model";
import { AvailabilityModel } from "../Models/Availability.model";
import { assignToDate, assignToStaff, generateHoursForStaffs } from "./helpers";
import { SlotModel } from "../Models/Slot.model";
import { StudentModel } from "../Models/Student.model";
import mongoose, { ObjectId } from "mongoose";
import { IBookingStatus } from "../Models/interfaces";
export const getAllStaffs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const staffs: Array<{ name: string; staffId: string }> =
      await StaffModel.find({}, { name: 1, staffId: 1 });
    res.json({
      success: true,
      data: staffs,
    });
  } catch (e) {
    res.status(404).json({ success: false });
  }
};

export const createStaffs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const staffs: any = req.body;
    if (!Array.isArray(staffs)) {
      res.status(400).json({ success: false, message: "Invalid Input" });
    }
    await StaffModel.insertMany(staffs);
    res.json({ success: true });
  } catch (e) {
    res.json({
      success: false,
      message: "Error Occurred in inserting objects array",
    });
  }
};

export const requestAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    startDate,
    endDate,
    staffs,
  }: { startDate: string; endDate: string; staffs: { _id: string }[] } =
    req.body;
  if (!startDate || !endDate || !Array.isArray(staffs)) {
    res.status(400).json({ success: false, message: "Invalid input" });
  }
  let slots: any = generateHoursForStaffs();
  try {
    const slotsGenerated: any = assignToDate(startDate, endDate, slots);
    const result: any = assignToStaff(staffs, slotsGenerated);
    console.log(result);
    await AvailabilityModel.insertMany(result);
    res.json({ message: "Request Received And Success" });
  } catch (error: any) {
    console.error("Error" + error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllResponses = async (
  req: Request,
  res: Response
): Promise<void> => {
  let dbData: Array<any> = await AvailabilityModel.find({}).populate({
    path: "instructorId",
    select: "staffId name email phNo -_id",
  });
  let results: Array<{
    staffId: string;
    phoneNumber: string;
    name: string;
    email: string;
    unmodifiedCount: number;
  }> = dbData.map((el) => ({
    staffId: el.instructorId.staffId,
    phoneNumber: el.instructorId.phNo,
    name: el.instructorId.name,
    email: el.instructorId.email,
    unmodifiedCount: el.unmodifiedCount,
  }));
  res.status(200).json({
    message: "Success",
    result: results,
  });
};

export const getResponseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  let id: string = req.params.id;
  try {
    let results: Array<any> = await AvailabilityModel.aggregate([
      {
        $lookup: {
          from: "staffs",
          localField: "instructorId",
          foreignField: "_id",
          as: "staff",
        },
      },
      {
        $unwind: "$staff",
      },
      {
        $match: {
          "staff.staffId": id,
          "availableSlots.slots.isAvailable": "Accepted",
        },
      },
      {
        $unwind: "$availableSlots",
      },
      {
        $unwind: "$availableSlots.slots",
      },
      {
        $match: {
          "availableSlots.slots.isAvailable": "Accepted",
        },
      },
      {
        $group: {
          _id: {
            staffId: "$staff.staffId",
            name: "$staff.name",
            mail: "$staff.mail",
            date: "$availableSlots.date",
          },
          slots: {
            $push: {
              time: "$availableSlots.slots.time",
              isAvailable: "$availableSlots.slots.isAvailable",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            staffId: "$_id.staffId",
            name: "$_id.name",
            mail: "$_id.mail",
          },
          availableSlots: {
            $push: {
              date: "$_id.date",
              slots: "$slots",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          staffId: "$_id.staffId",
          name: "$_id.name",
          mail: "$_id.mail",
          availableSlots: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Success",
      Result: results[0],
    });
  } catch (e) {
    res.status(404).json({ message: `Error Occurred`, error: e });
  }
};

export const getAcceptedResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result: Array<any> = await AvailabilityModel.find(
      { unmodifiedCount: 0 },
      {
        availableSlots: 0,
        _id: 0,
        __v: 0,
      }
    ).populate({
      path: "instructorId",
      select: "name staffId -_id ",
    });
    if (result.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "There's no matching found" });
    } else {
      res.status(200).json({ success: true, data: result });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Unknown Error Occurred in Server" });
  }
};

export const slots = async (req: Request, res: Response): Promise<void> => {
  let data: any = req.body;
  const students: Array<{ _id: ObjectId }> = await StudentModel.find(
    { year: req.body.year },
    "_id"
  );
  const ids: ObjectId[] = students.map((e) => e._id);
  let bookers: Array<IBookingStatus> = ids.map((e) => ({
    studentId: e,
    isBooked: false,
    bookingTime: "",
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
