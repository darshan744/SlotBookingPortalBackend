import mongoose  from "mongoose";

interface IAvailability {
    instructorId : mongoose.Schema.Types.ObjectId,
    unmodifiedCount : Number,
    deleteAt: Date,
    availableSlots : 
    {
        date : string ,
         slots: 
         {
            time : string,
            isAvailable:string
        }[]
    }[]
}
const AvailabilitySchema = new mongoose.Schema<IAvailability>({
    instructorId: { type: mongoose.Types.ObjectId, ref: 'Staff', required: true },
    unmodifiedCount: { type: Number, default: 0 },
    deleteAt: { type: Date },
    availableSlots: [{
        type: {
            date: String,
            slots: [{
                time: String,
                isAvailable: { type: String },
            }]
        }
    }]
})

async function unmodifiedCount(doc : IAvailability) {
    let count : number = 0;
    try {
        for(const slot of doc.availableSlots) {
            slot.slots.forEach((element) => {
                if(element.isAvailable === 'unmodified') {
                    count++;
                }
            });
        }
        doc.unmodifiedCount = count;
    } catch (e :any) {
        console.error(e.message);
    }
}
AvailabilitySchema.pre('insertMany',function(next ,docs) {
    for(let doc of docs) {
        unmodifiedCount(doc);
    }
    next();
})

export const AvailabilityModel = mongoose.model("Availability", AvailabilitySchema);
