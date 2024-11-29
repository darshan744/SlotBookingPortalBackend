import { NextFunction, Request, Response } from "express";
import { StaffModel } from "../../Models/Staff.model";


/**
 * @Route api/v1/SuperAdmin/staffs
 * @description
 * Returns all the staff for requesting them for their availability
 */
export const getAllStaffs = async (req: Request, res: Response,next: NextFunction): Promise<void> => {
    try {
      const staffs: Array<{ name: string; staffId: string }> =
        await StaffModel.find({}, { name: 1, staffId: 1 });
      res.json({
        success: true,
        data: staffs,
      });
    } catch (e) {
      res.status(404).json({ success: false });
    }
  };
  