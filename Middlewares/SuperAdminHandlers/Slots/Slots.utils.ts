import mongoose from "mongoose";
import { IAvailability } from "../../../Models/interfaces";
import { TAvailableSlots, TId, TSlotResponses } from "./Slots.Types";

/**
 *
 * @param staffID _id and id of the staff retrieved
 * @param e each staff's availability
 * @returns string -> of the corressponding staff's id
 */
export function findStaffId(staffID: TId[], e: IAvailability): string {
  return (
    staffID.find((el) => el._id.toString() === e.instructorId.toString())?.id ??
    ""
  );
}
/**
 *
 * @param availableSlots available slots of the staff
 * @returns slot's timings[] of the time where staff has accepted for availability
 * @description This function takes the available timings of the staff
 * return s the slot's timings that staff has given `Accepted`
 */
export function mapAvailableSlots(availableSlots: IAvailability["availableSlots"]) {
  return availableSlots.map(
    (el: TAvailableSlots): TAvailableSlots => ({
      date: el.date,
      slots: el.slots.filter(
        (slot: TSlotResponses): boolean => slot.isAvailable === "Accepted"
      ),
    })
  );
}
/**
 * @param students ObjectId[] of student's object id
 * @returns the default values for the booking status instance
 */
export function mapStudentDefaultData(students : mongoose.Schema.Types.ObjectId[]) {
    return students.map((e) => ({
      //student object id
      studentId: e,
      //default values
      isBooked: false,
      bookingDate: null,
      bookingTime: null,
      slotFinished: false,
    }));
}