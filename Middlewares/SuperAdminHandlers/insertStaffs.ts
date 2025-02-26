import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../Models/User.model";

export const createStaffs = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    try {
      const staffs: any = req.body;
      if (!Array.isArray(staffs)) {
        res.status(400).json({ success: false, message: "Invalid Input" });
      }
      await UserModel.insertMany(staffs);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Error Occurred in inserting objects array",
      });
    }
  };
  