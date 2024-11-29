import { Request, Response } from "express";
import { AvailabilityModel } from "../../Models/Availability.model";


/**
 * 
 * @for The table in the SuperAdmin 
 *  
 */
export const acceptanceStatus = async (req: Request,res: Response): Promise<void> => {
    let dbData: Array<any> = await AvailabilityModel.find({}).populate({
      path: "instructorId",
      select: "staffId name email phNo -_id",
    });
    let results: Array<{
      staffId: string;
      phoneNumber: string;
      name: string;
      email: string;
      unmodifiedCount: number;
    }> = dbData.map((el) => ({
      staffId: el.instructorId.staffId,
      phoneNumber: el.instructorId.phNo,
      name: el.instructorId.name,
      email: el.instructorId.email,
      unmodifiedCount: el.unmodifiedCount,
    }));
    res.status(200).json({
      message: "Success",
      result: results,
    });
  };