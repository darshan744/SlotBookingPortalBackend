import { Request , Response } from "express";
import mongoose from 'mongoose';
import { SlotModel } from "../../Models/Slot.model";
/**
 * @route - api/v1/Students/slots/:id/:eventType
 */
export const slots = async (req: Request, res: Response): Promise<void> => {
    let event = req.params.eventType;
    const year = req.query.year;
    event = event.replace('_',' ')
    let user = req.session.user;
    let studentObjectId = new mongoose.Types.ObjectId(user.objectId??"")

    try {
      if (!studentObjectId) {
        res.status(404).json({ message: "Student Not Found" });
        return;
      }
      let slotsData = await SlotModel.findOne({
        eventType : event , 
        year : year , 
        endDate : {$gte : new Date()}}).lean();
      if(!slotsData) {
          res.status(404).json({ message: "No Data Found" , data : null});
          return;
      }
      if(slotsData) {
        slotsData.bookers = slotsData.bookers.filter(booker => booker.studentId.toString() === studentObjectId.toString());
      }
      console.log(slotsData);
      if(slotsData.bookers.length > 0 && slotsData.bookers[0].isBooked) {
          if(slotsData.bookers[0].slotFinished){
            res.status(404).json({message : "Not Found"})
            return;
          }
          res.json({success : true , message : "Already Booked" , data : slotsData.bookers[0]})
          return;
      }
      res.json({message : 'Slots Data Found' , data : slotsData});
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ success : false , message: "Error finding student", error: err.message });
    }
  };
  