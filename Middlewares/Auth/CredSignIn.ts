import { Request, Response } from "express";
import { IStaff, IStudent, IUser } from "../../Models/interfaces";
import { ResponseMessages } from "../../../Shared/Authenticate.enum";
import { UserModel } from "../../Models/User.model";
import mongoose from "mongoose";


/**
 * @method POST
 * @route   /api/v1/login
 * @param req  - contains the user pass and id
 * @param res  - sends the response to the user
 */
export const authenticate = async (req: Request, res: Response) => {
    const credentials = req.body.user;
    console.log(credentials);
    try{
        let User : IStudent | IStaff | null | IUser= await UserModel.findOne({id:credentials.name})                        
        if( User && User.userType === 'Staff') {
            User = User as IStaff;
        }
        else if(User && User.userType === 'Student') {
            User = User as IStudent;
        }
        else if(User && User.userType === 'SuperAdmin') {
            User = User as IUser;
        }
        if(User && User.password === credentials.password) {
            console.log("passcorect");
            console.log(User.department);
            req.session.user = {
                objectId : (User._id as mongoose.Types.ObjectId).toString(),
                id:User.id,
                name : User.name,
                role:User.userType,
            }
            console.log('session: ' , req.session);
            console.log('sessionId : ' , req.sessionID);
            let data :any = {
                id: User.id,
                name: User.name,
                email: User.email,
                department: User.department,
                role:User.userType
            };
            'resume' in User ? data = {...data , resume : User.resume} : data;
            'year' in User ?  data = { ...data , year:User.year} : data;            
            res.json({success:true , data , role : User.userType , message:"Login Successful"});
        }
        else {
            res.json({success:false , message : ResponseMessages.USER_NOT_FOUND})
        }
    } catch(e : any){
        console.log(e.message);
        res.status(500).json({success:false , message:'error occured'})
    }
}
