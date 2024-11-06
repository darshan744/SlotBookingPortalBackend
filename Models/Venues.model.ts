import mongoose from "mongoose";

interface IVenues {
    venue : string,
    staffs :  string[],
    slots : {time : string,limit : number}[]
}
const VenuesSchema = new mongoose.Schema<IVenues>({
    venue: String,
    staffs: [{ type: String, ref: 'Staff' }],
    slots : [{
        time : String , 
        limit : Number
    }]
});
const VenuesModel = mongoose.model("Venues", VenuesSchema);
export {VenuesModel , VenuesSchema};