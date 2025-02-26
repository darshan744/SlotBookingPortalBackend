import { Request, Response } from "express";
import { AvailabilityModel } from "../../Models/Availability.model";

/**
 * 
 * @returns The staffs who've accepted that they are available in the given dates
 * 
 */
export const getAcceptedResponse = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: Array<any> = await AvailabilityModel.find(
        { unmodifiedCount: 0 , responseDeadline : {$lt : new Date()}},
        {
          availableSlots: 0,
          _id: 0,
          __v: 0,
        }
      ).populate({
        path: "instructorId",
        select: "name id -_id ",
      });
      if (result.length === 0) {
        res.status(404).json({ success: false, message: "There's no matching found" });
      } else {
        res.status(200).json({ success: true, data: result });
      }
    } catch (e) {
      res.status(500).json({ success: false, message: "Unknown Error Occurred in Server" });
    }
  };
  
  