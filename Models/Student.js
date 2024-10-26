const mongoose = require("mongoose");
const {StudentEventResultSchema} = require('../Models/StudentEventResult');
const StudentSchema = new mongoose.Schema({
    _id:String,
    name : String,
    department  :String,
    resume:{type : String},
    EventHistory : [{type : StudentEventResultSchema , ref: 'Event'}]
});
const StudentModel = mongoose.model("Student",StudentSchema);
module.exports = {StudentModel , StudentSchema};