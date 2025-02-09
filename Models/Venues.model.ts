import { Schema , model } from "mongoose";
import {IVenues2} from "./interfaces";

const VenuesSchema = new Schema<IVenues2>({
    venue: String,
    staffs: [{
        id : String,
        slots: [{
                date: Date,
                timings : [{time: String, limit: Number}],
            }]
        }]
    },{_id : false});
export {VenuesSchema};