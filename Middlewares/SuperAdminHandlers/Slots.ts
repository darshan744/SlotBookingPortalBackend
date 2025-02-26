import { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { StudentModel } from "../../Models/Student.model";
import { IBookingStatus, ISlot, IVenues2 } from "../../Models/interfaces";
import { AvailabilityModel } from "../../Models/Availability.model";
import { TAvailability } from "./SuperAdmin.interface";
import { StaffModel } from "../../Models/Staff.model";
import { ISlotRequest } from "../function.interfaces";
import { mapTimings } from "../../Utils/TimeManipulation";
import { SlotModel } from "../../Models/Slot.model";

type TId = { _id: ObjectId; id: string };
type TSlotResponses = TAvailability["availableSlots"][0]["slots"][0];
type TAvailableSlots = TAvailability["availableSlots"][0];
type TAcceptedResponse = Pick<
  TAvailability,
  "availableSlots" | "instructorId"
> & { id: string };

class GetSlot {
  slotID: string;
  startDate: Date;
  endDate: Date;
  eventType: string;
  year: string;

  constructor(
    slotId: string,
    startDate: Date,
    endDate: Date,
    eventType: string,
    year: string
  ) {
    this.slotID = slotId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.eventType = eventType;
    this.year = year;
  }
}

/**
 * @for Creating The slots in the Database
 */
export const getSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    //get all the slots data
    const slots = await SlotModel.find({}, { _id: 0 }).lean<ISlot[]>();
    console.log(slots);
    // get the corressponding staff's details we need only the name by looping through the slots[] data
    for (const slot of slots) {
      const staffs = await StaffModel.find(
        { id: {$in : slot.slots.map(e => e.staffs.map(s => s.id).flat())} },
        { name: 1, _id: 0, id: 1 }
      );
      console.log(staffs);
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

export const postSlots2 = async (
  req: Request,
  res: Response
): Promise<void> => {
  let data: ISlotRequest = req.body;
  const students: Array<{ _id: ObjectId }> = await StudentModel.find(
    { year: data.year },
    { _id: 1 }
  );
  let studentObjectIds = students.map((e) => e._id);
  const bookers: Array<IBookingStatus> = studentObjectIds.map((e) => ({
    studentId: e,
    isBooked: false,
    bookingDate: null,
    bookingTime: null,
    slotFinished: false,
  }));
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
      id:
        staffsObjectId.find(
          (el) => el._id.toString() === e.instructorId.toString()
        )?.id ?? "",
      availableSlots: e.availableSlots.map(
        (el: TAvailableSlots): TAvailableSlots => ({
          date: el.date,
          slots: el.slots.filter(
            (slot: TSlotResponses): boolean => slot.isAvailable === "Accepted"
          ),
        })
      ),
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
    //maps the timings generated in frontend
    // to the staffs accepted timings
    let venues = mapTimings(
      data.venuesAndStaffs,
      data.slots,
      staffAcceptedResponse
    );
    //const slotObj = new SlotModel(slotID , data.startDate , data.endDate , data.eventType , data.year , venues , bookers );
    const slots = new Slot(
      slotID,
      data.startDate,
      data.endDate,
      data.eventType,
      data.year,
      venues,
      bookers
    );
    //console.log(slots);
    await SlotModel.insertMany(slots);
    res.json({ message: "Inserterd Successfully" });
  } catch (error: any) {
    res.status(500).json({ e: "Error in creating slot" });
  }
};

class Slot {
  slotId: string;
  startDate: Date;
  endDate: Date;
  eventType: string;
  year: string;
  slots: IVenues2[]; // List of venues with accepted slots
  bookers: IBookingStatus[]; // List of booking statuses for each student

  constructor(
    slotId: string,
    startDate: string,
    endDate: string,
    eventType: string,
    year: string,
    slots: IVenues2[],
    bookers: IBookingStatus[]
  ) {
    this.slotId = slotId;
    const startDateSplit: string[] = startDate.split("/");
    const endDateSplit: string[] = endDate.split("/");
    //when using the default material.angular date picker's date string when converted to Date Object we got previous day
    //this is due to js' timezone handling -> js converts the date to a UTC standart date object
    //bcoz js uses UTC defaultly so we convert the default date string in frontend to dd/mm/yyyy
    //then split'em up we get [dd,mm,yyyy] then using js' Date.UTC() which will set the Time zone to 000000
    //hence the date will be in the same day;
    this.startDate = new Date(
      new Date(
        Date.UTC(
          parseInt(startDateSplit[2]),
          parseInt(startDateSplit[1]) - 1,
          parseInt(startDateSplit[0])
        )
      )
    );
    this.endDate = new Date(
      new Date(
        Date.UTC(
          parseInt(endDateSplit[2]),
          parseInt(endDateSplit[1]) - 1,
          parseInt(endDateSplit[0])
        )
      )
    );
    this.eventType = eventType;
    this.year = year;
    this.slots = slots;
    this.bookers = bookers;
  }
}
