const mongoose = require("mongoose");
const StudentEventResultSchema = new mongoose.Schema({
    _id:String,
    eventType : String,
    isPresent:Boolean,
    marks:Number,
    remarks: String,
})
const StudentEventResultModel = mongoose.model("StudentEventResult",StudentEventResultSchema);
module.exports = {StudentEventResultModel , StudentEventResultSchema};