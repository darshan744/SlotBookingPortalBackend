import mongoose  from "mongoose";
import {IAvailability} from './interfaces'

const AvailabilitySchema = new mongoose.Schema<IAvailability>({
    instructorId: { type: mongoose.Types.ObjectId, ref: 'Staff', required: true },
    unmodifiedCount: { type: Number, default: 0 },
    responseDeadline : Date,
    forYear : String,
    eventType : String,
    availableSlots: [{
        type: {
            date: Date,
            slots: [{
                time: String,
                isAvailable: String,
            }]
        }
    }],

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

