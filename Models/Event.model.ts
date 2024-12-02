import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    Name:String,
    Description:String,
    MaximumParticipants : Number
})
export const eventModel =  mongoose.model('Events' , eventSchema)