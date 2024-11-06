import mongoose from "mongoose";

interface IStudentEventResult {
    id : string,
    eventType : string,
    isPresent : boolean,
    marks  :number,
    remarks : string
}

export const  StudentEventResultSchema = new mongoose.Schema<IStudentEventResult>({
    id: { type: String, required: true },
    eventType: { type: String},
    isPresent: { type: Boolean, required: true },
    marks: { type: Number,  },
    remarks: { type: String,  }
})
export const StudentEventResultModel = mongoose.model("StudentEventResult",StudentEventResultSchema);
