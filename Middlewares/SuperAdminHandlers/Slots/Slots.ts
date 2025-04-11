import { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { StudentModel } from "../../../Models/Student.model";
import { IBookingStatus, ISlot, IVenues2 } from "../../../Models/interfaces";
import { AvailabilityModel } from "../../../Models/Availability.model";
import { StaffModel } from "../../../Models/Staff.model";
import { ISlotRequest } from "../../function.interfaces";
import { mapTimings } from "../../../Utils/TimeManipulation";
import { SlotModel } from "../../../Models/Slot.model";
import {TId,TAcceptedResponse} from "./Slots.Types";
import {findStaffId , mapAvailableSlots, mapStudentDefaultData} from './Slots.utils'
import {Slot} from './Slots.class'


export const getSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    //get all the slots data
    let slots = await SlotModel.find({}, { _id: 0 }).lean<ISlot[]>();
    // get the corressponding staff's details we need only the name by looping through the slots[] data
    for (let slot of slots) {
      for (let venue of slot.slots) {
        // TODO : correctly show data with staff's name 
        // TODO : correctly show with student's name
      }
    }
    //get the corresponding student's details we need only the name
    const students = await StudentModel.find(
      { year: { $in: slots.map((e) => e.year) } },
      { name: 1, id: 1, _id: 0 }
    );
    res.json({ success: true, message: "Suceeded", data: slots });
  } catch (error: any) {
    res.status(500).json({ e: "Error in getting slots" });
  }
};

export const postSlots2 = async (req: Request,res: Response): Promise<void> => {
  let data: ISlotRequest = req.body;
  // getting students data for bookers property 
  const students: Array<{ _id: ObjectId }> = await StudentModel.find(
    { year: data.year },
    { _id: 1 }
  );
  // we need only object id
  let studentObjectIds = students.map((e) => e._id);
  // creating bookers array and substituting properites
  const bookers: Array<IBookingStatus> = mapStudentDefaultData(studentObjectIds);
  // getting staff's availability so that we can map to staffs'
  // corressponding staff's available timing
  let staffAvailabilityCursor = await AvailabilityModel.find(
    { responseDeadline: { $gte: new Date() } },
    { unmodifiedCount: 0 },
    { availableSlots: 1, instructorId: 1, _id: 0 }
  );
  let staffIds = data.venuesAndStaffs.map((e) => e.staffs).flat(); //flat() converts 2d Array to 1d Array
  /**
   * We have the instructor id as objectId and the id as the string id
   * so to compare and  retrieve the corresponding response of the staff we get
   * the object id of the staff using $in operator which is similar as .includes
   */
  let staffsObjectId: TId[] = await StaffModel.find(
    { id: { $in: staffIds } },
    { _id: 1, id: 1, userType: 0 }
  );
  /**
   * @desc filtering out only the accepted timing to create the slot with their corresponding timings
   *   and its corresponding instructors id (ObjectID)
   */
  
  let staffAcceptedResponse: TAcceptedResponse[] = staffAvailabilityCursor.map(
    (e) => ({
      //stored as object id
      instructorId: e.instructorId,
      id: findStaffId(staffsObjectId, e),
      availableSlots: mapAvailableSlots(e.availableSlots),
    })
  );
  
  /**
   * @desc id for the slot with containing startDate_endDate_eventType
   * @example = 2024-12-25_2024-12-30_Mock Interview
   */
  try {
    const slotID = `${data.startDate.split("T")[0]}_${
      data.endDate.split("T")[0]
    }_${data.eventType}`;
    //maps the timings generated in frontend to the staffs accepted timings
    console.log(staffAcceptedResponse[0].availableSlots);
    let venues = mapTimings(
      data.venuesAndStaffs,
      data.slots,
      staffAcceptedResponse
    );
    const slots = new Slot(slotID,data.startDate,data.endDate,data.eventType,data.year,venues,bookers);
    console.log(slots);
    await SlotModel.insertMany(slots);
    res.json({ message: "Inserterd Successfully" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ e: "Error in creating slot" });
  }
};

