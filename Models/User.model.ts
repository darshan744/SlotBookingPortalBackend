import { Schema, model } from "mongoose";
import { IUser } from "./interfaces";
import bcrypt from 'bcrypt';
const userSchema = new Schema<IUser>(
  {
    id: String,
    name: String,
    email: String,
    password: String,
    userType: String,
    department: String,
  },
  { discriminatorKey: "userType", timestamps: true }
);

userSchema.pre("save" , function (next) {
    if(this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password , 10);
    }
    next();
})

userSchema.methods.comparePassword = async function (pass:string) {
    return await bcrypt.compare(pass , this.password);
}


export const UserModel = model("User", userSchema);

export const SuperAdminModel = UserModel.discriminator(
  "SuperAdmin",
  new Schema({})
);
