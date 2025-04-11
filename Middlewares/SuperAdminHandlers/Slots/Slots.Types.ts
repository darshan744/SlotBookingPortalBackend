import { ObjectId } from "mongoose";
import { TAvailability } from "../SuperAdmin.interface";

export type TId = { _id: ObjectId; id: string };
export type TSlotResponses = TAvailability["availableSlots"][0]["slots"][0];
export type TAvailableSlots = TAvailability["availableSlots"][0];
export type TAcceptedResponse = Pick<
  TAvailability,
  "availableSlots" | "instructorId"
> & { id: string };