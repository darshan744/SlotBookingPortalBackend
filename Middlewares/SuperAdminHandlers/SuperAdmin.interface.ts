import mongoose from "mongoose";

export type TAvailability = {
    instructorId: mongoose.Schema.Types.ObjectId;
    responseDeadline: Date;
    availableSlots: {
        date: Date
        slots: {
            time: string;
            isAvailable: string;
        }[];
    }[];
}
