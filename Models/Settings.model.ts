import {Schema , model} from 'mongoose'
import {ISettings , IEvents , IBreaks} from './interfaces'

const settingsSchema = new Schema({},{discriminatorKey : 'settingType' , timestamps : true})

const eventSchema = new Schema<IEvents>({
    Name:String,
    Description:String,
    MaximumParticipants : Number
})

const breaksSchema = new Schema<IBreaks>({
    configurationId:  {type : String , unique:true},
    breaks : {
        morningBreak : String,
        eveningBreak : String,
        lunchStart : String,
        lunchEnd : String,
    }
})
export const SettingsModel = model<ISettings>('settings',settingsSchema);
export const EventModel =  SettingsModel.discriminator<IEvents>('Event', eventSchema);
export const BreaksModel =  SettingsModel.discriminator<IBreaks>('Breaks', breaksSchema);
