import { Schema , model } from "mongoose";
import { IVenues } from "./interfaces";

const VenuesSchema = new Schema<IVenues>({
    venue: String,
    staffs: [{ type: String, ref: 'Staff' }],
    slots : [{
        time : String , 
        limit : Number
    }]
});
const VenuesModel = model("Venues", VenuesSchema);
export {VenuesModel , VenuesSchema};