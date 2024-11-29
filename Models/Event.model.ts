import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    name:String,
    Description:String,
})
export const eventModel =  mongoose.model('Events' , eventSchema)