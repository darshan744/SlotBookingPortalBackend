import mongoose from "mongoose";
import {IStaff} from './interfaces'


const StaffSchema = new mongoose.Schema<IStaff>({
    staffId : {type : String , required: true},
    name: String,
    dept: String,
    phNo: String,
    email: String,
    eventHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

export const StaffModel = mongoose.model("Staff", StaffSchema);