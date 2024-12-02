import { Request, Response } from "express";
import { assignToDate, assignToStaff, generateHoursForStaffs, groupDates, i } from "../helpers";
import { AvailabilityModel } from "../../Models/Availability.model";

/**
 * @route  api/v1/SuperAdmin/staffs/availability
 * @description Post the Requesting SLots so that Staffs can find and give their respective Response  
 */
export const requestAvailability = async (req: Request,res: Response): Promise<void> => {
    const {
      startDate,
      endDate,
      staffs,
      responseDeadline
    }: { startDate: string; endDate: string; staffs: { _id: string , staffId : string , name:string }[] , 
      responseDeadline : Date } =
      req.body;
    console.log(staffs);
    res.json({message : " SUccesss" })
      if (!startDate || !endDate || !Array.isArray(staffs)) {
      res.status(400).json({ success: false, message: "Invalid input" });
    }
    let slots: string[] = generateHoursForStaffs();
    try {
      const slotsGenerated: groupDates[] = assignToDate(startDate, endDate, slots);
      const result: i[] = assignToStaff(staffs, slotsGenerated , responseDeadline);
      console.log(result);
      await AvailabilityModel.insertMany(result);
      res.json({ message: "Request Received And Success" });
    } catch (error: any) {
      console.error("Error" + error);
      res.json({ success: false, message: error.message });
    }
  };
  
  