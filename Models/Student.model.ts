
import mongoose from "mongoose";
import { StudentEventResultSchema } from "./StudentEventResult.model";
import {IStudent, IUser} from './interfaces'
import { UserModel } from "./User.model";

const StudentSchema = new mongoose.Schema<IStudent>({
    
    year: String,
    upcomingEvent:String,
    resume: { type: String },
    EventHistory: [{type : StudentEventResultSchema}]
})
export const StudentModel = UserModel.discriminator<IUser>('Student', StudentSchema);