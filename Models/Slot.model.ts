import mongoose from "mongoose";
import { VenuesSchema } from "./Venues.model";
import { BookingStatusSchema } from "./BookingStatus.model";

interface ISlot {
    id : string,
    startDate : Date,
    endDate : Date,
    eventType : String,
    year : String,
    slots : typeof VenuesSchema[],
    bookers : typeof BookingStatusSchema[]
}

const SlotSchema = new mongoose.Schema<ISlot>({
    id: String, 
    startDate: Date,
    endDate: Date,
    eventType: String, 
    year : String,// Mi SI GD
    slots : [VenuesSchema],
    bookers: [{type : BookingStatusSchema , ref : 'BookingStatus'}]
});

export const SlotModel = mongoose.model("Slot", SlotSchema);
