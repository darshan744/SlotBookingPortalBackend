import { Request, Response } from "express";
import { AvailabilityModel } from "../../Models/Availability.model";
import {IAvailability, IStaff} from "../../Models/interfaces";


/**
 * 
 * @for The table in the SuperAdmin 
 *  
 */
export const acceptanceStatus = async (req: Request,res: Response): Promise<void> => {
    let dbData: Array<any>;
    dbData = await AvailabilityModel.find({responseDeadline : {$gt : new Date() }}, {unmodifiedCount: 1, forYear: 1, eventType: 1}).populate({
        path: "instructorId",
        select: "id name email phNo -_id",
    });
    let results: Array<{
      id: string;
      phoneNumber: string;
      name: string;
      email: string;
      unmodifiedCount: number;
    }> = dbData.map(el => ({
      id: el.instructorId.id,
      phoneNumber: el.instructorId.phNo,
      name: el.instructorId.name,
      email: el.instructorId.email,
      unmodifiedCount: el.unmodifiedCount,
        forYear : el.forYear,
        eventType : el.eventType,
    }));
    res.status(200).json({
      message: "Success",
      result: results,
    });
  };