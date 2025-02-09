import { Schema , model} from 'mongoose';
import { IUser } from './interfaces';

    const userSchema = new Schema<IUser>({
        id : String,
        name:String,
        email : String,
        password : String,
        userType:String,
        department :String,
    },{discriminatorKey : 'userType', timestamps:true});
    export const UserModel = model('User' , userSchema);

    export const SuperAdminModel = UserModel.discriminator('SuperAdmin' ,new Schema({}));