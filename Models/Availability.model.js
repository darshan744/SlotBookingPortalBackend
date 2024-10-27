const mongoose = require("mongoose");
const AvailabilitySchema = new mongoose.Schema({
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
});

/* helper function */
async function  unmodifiedCountHelper(doc) {
    let count = 0;
    try {
        for (const slot of doc.availableSlots) {
            slot.slots.forEach(element => {
                if (element.isAvailable === 'unmodified') {
                    count++;
                }
            });
        }
        doc.unmodifiedCount = count;
    } catch (e) {
        console.error(e.message + " From helper function ")
    }
}

AvailabilitySchema.pre("save", function (next) {
    unmodifiedCountHelper(this);
    next();
});
AvailabilitySchema.pre("insertMany", function(next , docs) {
    for ( const doc of docs) {
        unmodifiedCountHelper(doc);
    }
    next();
})
const AvailabilityModel = mongoose.model("Availability", AvailabilitySchema);

module.exports = AvailabilityModel;