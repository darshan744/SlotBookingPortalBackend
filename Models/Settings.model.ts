import {Schema , model} from 'mongoose'

const settingsSchema = new Schema({
    settingType : {type : String},
    id : {type : String , unique : true},
},{discriminatorKey : 'configName' , timestamps : true})
const settingsModel = model('settings',settingsSchema);
const eventSchema = new Schema({
    Name:String,
    Description:String,
    MaximumParticipants : Number
})
export const EventModel =  settingsModel.discriminator('Event', eventSchema);
