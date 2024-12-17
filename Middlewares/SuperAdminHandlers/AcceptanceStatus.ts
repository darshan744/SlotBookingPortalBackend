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
      select: "id name email phNo -_id",
    });
    console.log(dbData);
    let results: Array<{
      id: string;
      phoneNumber: string;
      name: string;
      email: string;
      unmodifiedCount: number;
    }> = dbData.map((el) => ({
      id: el.instructorId.id,
      phoneNumber: el.instructorId.phNo,
      name: el.instructorId.name,
      email: el.instructorId.email,
      unmodifiedCount: el.unmodifiedCount,
    }));
    console.log(results);
    res.status(200).json({
      message: "Success",
      result: results,
    });
  };