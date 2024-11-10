import mongoose from "mongoose";
import { IVenues } from "./interfaces";

const VenuesSchema = new mongoose.Schema<IVenues>({
    venue: String,
    staffs: [{ type: String, ref: 'Staff' }],
    slots : [{
        time : String , 
        limit : Number
    }]
});
const VenuesModel = mongoose.model("Venues", VenuesSchema);
export {VenuesModel , VenuesSchema};