import {Schema , model} from 'mongoose';
import {IQuery} from './interfaces'
const querySchema = new Schema<IQuery>({
    raiserId :{
        type:String,
    },
    queryId : {
        type:String,
        requried:true,
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String, 
        required:true,
    },
    status : {
        type:String,
        defualt:"Pending",
        enum:["Pending" , "Resolved", "Rejected"]
    },
    remarks:{
        type:String,
        default:null
    }
})
export const queryModel = model<IQuery>('Queries' , querySchema)
