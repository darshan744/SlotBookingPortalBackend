import mongoose  from "mongoose";
import {IAvailability} from './interfaces'

const AvailabilitySchema = new mongoose.Schema<IAvailability>({
    instructorId: { type: mongoose.Types.ObjectId, ref: 'Staff', required: true },
    unmodifiedCount: { type: Number, default: 0 },
    // deleteAt: { type: Date },
    availableSlots: [{
        type: {
            date: Date,
            slots: [{
                time: String,
                isAvailable: { type: String },
            }]
        }
    }],
    responseDeadline : Date
})

function unmodifiedCount(doc : IAvailability) {
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
AvailabilitySchema.pre('save', function (next) {
    unmodifiedCount(this);
    next();
});
export const AvailabilityModel = mongoose.model("Availability", AvailabilitySchema);

