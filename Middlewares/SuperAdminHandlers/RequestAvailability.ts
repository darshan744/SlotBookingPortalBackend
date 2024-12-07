import { IAvailability } from './../type.interfaces';
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
    const body : IAvailability[] = req.body;
    console.log(body[0].availableSlots);
    // console.log('======================================================================');
    const ids : string[] = body.map(e=>(e.instructorId) as string);
    console.log(ids);
    try {
      const objectids : any = await StaffModel.find({
        id:{
          $in:ids
      }},{
        _id:1 , id : 1
      })
      // console.log(objectids);
      const assigned : any =  assignObjectId(body , objectids);
      // console.log('--------------------------------------------------------------------');
      // console.log(assigned);
      await AvailabilityModel.insertMany(assigned);
      console.log(assigned[0].availableSlots);
      res.status(200).json({ success : true, message: "Request Sent" });
    } catch (error: any) {
      console.error("Error" + error);
      res.status(500).json({ success: false, message: 'Failed To send request' });
    }
  };

  function assignObjectId (data : IAvailability[] , objectids:{_id:mongoose.Types.ObjectId , id:string}[])  {
     for(const datum of data) {
        const staffObjectId =  objectids.find(e=>datum.instructorId === e.id)?._id;
        if(staffObjectId) {
          datum.instructorId = staffObjectId;
        } 
     }
     return data;
  }
  