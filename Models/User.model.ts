import mongoose from 'mongoose';
import { IUser } from './interfaces';

const userSchema = new mongoose.Schema<IUser>({
    id : String,
    objectId : mongoose.Types.ObjectId,
    email : String,
    password : String,
    role:String,
})
export const UserModel = mongoose.model('User' , userSchema);