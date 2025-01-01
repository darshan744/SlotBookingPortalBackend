import { TAvailability } from "../function.interfaces";
import { Request, Response } from "express";
import { AvailabilityModel } from "../../Models/Availability.model";
import mongoose from "mongoose";
import { StaffModel } from '../../Models/Staff.model';


/**
 * @method POST
 * @route  api/v1/SuperAdmin/staffs/availability
 * @description Post the Requesting SLots so that Staffs can find and give their respective Response  
 */
export const requestAvailability = async (req: Request,res: Response): Promise<void> => {
    const body : TAvailability[] = req.body;
    const ids : string[] = body.map(e=>(e.instructorId).toString());
    try {
      const objectIds : any = await StaffModel.find({
        id:{
          $in:ids
        }
      },{
        _id:1 , id : 1
      })
      const assigned : any =  assignObjectId(body , objectIds);
      await AvailabilityModel.insertMany(assigned);
      res.status(200).json({ success : true, message: "Request Sent" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed To send request' });
    }
  };

  function assignObjectId (data : TAvailability[] , objectIds:{_id:mongoose.Schema.Types.ObjectId , id:string}[])  {
     for(const datum of data) {
        const staffObjectId =  objectIds.find(e=>(datum.instructorId).toString() === e.id)?._id;
        if(staffObjectId) {
          datum.instructorId = staffObjectId;
        } 
     }
     return data;
  }
  