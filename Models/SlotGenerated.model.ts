import mongoose from "mongoose";
import {ISlotGenerated} from './interfaces'

const SlotGeneratedSchema = new mongoose.Schema<ISlotGenerated>({
    date: Date,
    startTime: String,
    endTime: String,
    isAvailable: Boolean
});
export const SlotGeneratedModel = mongoose.model("SlotGenerated", SlotGeneratedSchema);