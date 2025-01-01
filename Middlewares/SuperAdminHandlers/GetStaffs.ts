import {  Request, Response } from "express";
import { StaffModel } from "../../Models/Staff.model";
import {EventModel} from "../../Models/Settings.model";

/**
 * @Route api/v1/SuperAdmin/staffs
 * @description
 * Returns all the staff for requesting them for their availability
 */
export const getAllStaffs = async (req: Request, res: Response): Promise<void> => {
    try {
      const staffs: Array<{ name: string; id: string }> =
        await StaffModel.find({}, { name: 1, id: 1 , _id:0 ,userType:0});
      let event = await EventModel.find({} , {Name : 1 , _id : 0});
      let event1 = event.map(e=>e.Name);
      res.json({
        success: true,
        message : "Successfully Retrieved Staffs and Events",
        staffs,
        events : event1
      });
    } catch (e) {
      res.status(404).json({ success: false });
    }
  }
