import mongoose from "mongoose";

interface ISlotGenerated {
    date: Date,
    startTime: string,
    endTime: string,
    isAvailable: boolean
}
const SlotGeneratedSchema = new mongoose.Schema({
    date: Date,
    startTime: String,
    endTime: String,
    isAvailable: Boolean
});
export const SlotGeneratedModel = mongoose.model("SlotGenerated", SlotGeneratedSchema);