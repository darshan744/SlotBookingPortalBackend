import mongoose from "mongoose";
import { StudentEventResultSchema } from "./StudentEventResult.model";
import {IStudent} from './interfaces'

const StudentSchema = new mongoose.Schema<IStudent>({
    studentId:String,
    name : String,
    department  :String,
    email:String,
    year : String,
    password : String,
    resume :{type : String},
    EventHistory : [{type : StudentEventResultSchema , ref: 'Event'}]
});

export const StudentModel = mongoose.model("Student",StudentSchema);