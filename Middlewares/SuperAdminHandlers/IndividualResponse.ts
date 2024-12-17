import { Request, Response } from "express";
import { AvailabilityModel } from "../../Models/Availability.model";


/**
 * @for The table in the SuperAdmin when Individual Id is Clicked
 * @returns The individual Staffs accepted SLot timings 
 */

export const getResponseById = async (req: Request,res: Response ): Promise<void> => {
    let id: string = req.params.id;
    try {
      let results: Array<any> = await AvailabilityModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "instructorId",
            foreignField: "_id",
            as: "staff",
          },
        },
        {
          $unwind: "$staff",
        },
        {
          $match: {
            "staff.id": id,
            "availableSlots.slots.isAvailable": "Accepted",
          },
        },
        {
          $unwind: "$availableSlots",
        },
        {
          $unwind: "$availableSlots.slots",
        },
        {
          $match: {
            "availableSlots.slots.isAvailable": "Accepted",
          },
        },
        {
          $group: {
            _id: {
              id: "$staff.id",
              name: "$staff.name",
              mail: "$staff.mail",
              date: "$availableSlots.date",
            },
            slots: {
              $push: {
                time: "$availableSlots.slots.time",
                isAvailable: "$availableSlots.slots.isAvailable",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              staffId: "$_id.staffId",
              name: "$_id.name",
              mail: "$_id.mail",
            },
            availableSlots: {
              $push: {
                date: "$_id.date",
                slots: "$slots",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: "$_id.id",
            name: "$_id.name",
            mail: "$_id.mail",
            availableSlots: 1,
          },
        },
      ]);
  
      res.status(200).json({
        message: "Success",
        Result: results[0],
      });
    } catch (e) {
      res.status(404).json({ message: `Error Occurred`, error: e });
    }
  };
  