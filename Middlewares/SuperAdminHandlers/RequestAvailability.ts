import { Request, Response } from "express";
import { assignToDate, assignToStaff, generateHoursForStaffs } from "../helpers";
import { AvailabilityModel } from "../../Models/Availability.model";

/**
 * @description Post the Requesting SLots so that Staffs can find and give their respective Response  
 */
export const requestAvailability = async (req: Request,res: Response): Promise<void> => {
    const {
      startDate,
      endDate,
      staffs,
    }: { startDate: string; endDate: string; staffs: { _id: string }[] } =
      req.body;
    if (!startDate || !endDate || !Array.isArray(staffs)) {
      res.status(400).json({ success: false, message: "Invalid input" });
    }
    let slots: any = generateHoursForStaffs();
    try {
      const slotsGenerated: any = assignToDate(startDate, endDate, slots);
      const result: any = assignToStaff(staffs, slotsGenerated);
      console.log(result);
      await AvailabilityModel.insertMany(result);
      res.json({ message: "Request Received And Success" });
    } catch (error: any) {
      console.error("Error" + error);
      res.json({ success: false, message: error.message });
    }
  };
  
  