import mongoose from "mongoose";
import { VenuesSchema } from "./Venues.model";
import { BookingStatusSchema } from "./BookingStatus.model";
import {ISlot} from './interfaces'

const SlotSchema = new mongoose.Schema<ISlot>({
    slotId: { type : String , unique : true}, 
    startDate: Date,
    endDate: Date,
    eventType: String, 
    year : String,
    slots : [VenuesSchema],
    bookers: [{type : BookingStatusSchema , ref : 'BookingStatus'}]
});


export const SlotModel = mongoose.model("Slot", SlotSchema);
