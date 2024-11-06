import mongoose from "mongoose";
import { StudentEventResultSchema } from "./StudentEventResult.model";

interface IStudent {
    studentId:String,
    name : String,
    department  :String,
    email:String,
    year : String,
    password : String,
    resume :{type : String},
    EventHistory : typeof StudentEventResultSchema[]
}

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