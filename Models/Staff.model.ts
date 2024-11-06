import mongoose from "mongoose";

interface IStaff {
    staffId : string,
    name: string,
    dept: string,
    phNo: string,
    email: string,
    eventHistory: mongoose.Schema.Types.ObjectId[]
}

const StaffSchema = new mongoose.Schema<IStaff>({
    staffId : {type : String , required: true},
    name: String,
    dept: String,
    phNo: String,
    email: String,
    eventHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

export const StaffModel = mongoose.model("Staff", StaffSchema);