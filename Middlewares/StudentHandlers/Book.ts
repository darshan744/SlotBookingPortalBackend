import {Request , Response } from 'express';
import mongoose, {ClientSession, startSession} from 'mongoose';
import { SlotModel} from '../../Models/Slot.model';
import { StudentModel } from '../../Models/Student.model';


/**
 * @Description Here we are using transaction from mongoose to prevent multiple
 *  user from booking slot at a time which will cause a problem in limit
 */


interface ISlotBookingData {
    venue : string;
    time : string;
    eventType : string;
    date : string;
    staff:string;
    slotId : string;
}

export async function bookSlot (req: Request, res: Response): Promise<void> {
    const body : ISlotBookingData = req.body;
    let session : ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
       const cursor = await SlotModel.findOne({slotId : body.slotId}).session(session);
       // const cursor = await SlotModel.findOne({slotId : body.slotId});
       const userObjectId  = req.session.user.objectId;
       if(!cursor){
           res.status(404).json({success : false , message : "User Not Found"});
           return;
       }
       for(const slot of cursor.slots) {
           if(slot.venue === body.venue) {
               for (let staff of slot.staffs) {
                   staff.slots.forEach(DateAndTime => {
                       if(new Date(DateAndTime.date).toString() === new Date(body.date).toString()){
                           for (let timing of DateAndTime.timings) {
                               if (timing.time === body.time) {
                                   if(timing.limit > 0) {
                                    timing.limit -= 1;
                                   }
                                   else {
                                       throw new Error(`Limit exceeded for the timing on ${body.date} And ${timing.time}`);
                                   }
                               }
                           }
                       }
                   })
               }
           }
       }
       for(const booker of cursor.bookers) {
           if(booker.studentId.toString() === userObjectId){
               booker.isBooked = true;
               booker.bookingDate = new Date(body.date);
               booker.bookingTime = `${body.time}/${body.venue}/${body.staff}`
           }
       }
       await cursor.save({session : session});
       const studentCursor = await StudentModel.findOneAndUpdate({_id : new mongoose.Types.ObjectId(userObjectId)},
           {$set:{upcomingEvent : `${body.eventType}_${body.date}_${body.time}_${body.staff}_${body.venue}`}},{new : true});

       await session.commitTransaction();
       res.json({success : true ,slots:cursor.slots.filter(e=>e.venue === body.venue),bookers: cursor.bookers, message : "SlotBooked Successfully"});
    }catch (e : any) {
        await session.abortTransaction()
        res.json({message : e.message , success : false });
    }finally {
        await session.endSession()
    }
}