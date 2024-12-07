
import mongoose from "mongoose";
import {IStaff} from './interfaces'
import { UserModel } from "./User.model";


const StaffSchema = new mongoose.Schema<IStaff>({
        phNo: String,
        eventHistory: [{type : mongoose.Schema.Types.ObjectId , ref:'Event'}]
})
export const StaffModel = UserModel.discriminator('Staff', StaffSchema);