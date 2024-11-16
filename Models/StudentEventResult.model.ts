import mongoose from "mongoose";
import {IStudentEventResult} from './interfaces'

export const  StudentEventResultSchema = new mongoose.Schema<IStudentEventResult>({
    resultId: { type: String, required: true },
    eventType: { type: String},
    isPresent: { type: Boolean, required: true },
    marks: { type: Number,  },
    remarks: { type: String,  }
})
export const StudentEventResultModel = mongoose.model("StudentEventResult",StudentEventResultSchema);
