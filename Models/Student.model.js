const mongoose = require("mongoose");
const {StudentEventResultSchema} = require('./StudentEventResult.model');
const StudentSchema = new mongoose.Schema({
    studentId:String,
    name : String,
    department  :String,
    email:String,
    year : String,
    password : String,
    resume :{type : String},
    EventHistory : [{type : StudentEventResultSchema , ref: 'Event'}]
});
const StudentModel = mongoose.model("Student",StudentSchema);
module.exports = {StudentModel , StudentSchema};