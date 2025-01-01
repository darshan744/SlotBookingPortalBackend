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
           res.json({success : false , message : "User Not Found"});
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
       console.log(studentCursor);
       await session.commitTransaction();
       res.json({success : true ,slots:cursor.slots.filter(e=>e.venue === body.venue),bookers: cursor.bookers, message : "SlotBooked Successfully"});
    }catch (e : any) {
        console.log(e);
        await session.abortTransaction()
        res.json({message : e.message , success : false });
    }finally {
        await session.endSession()
    }
}


  /**
 * **Explanation**:
 * This MongoDB query updates the limit of a specific time slot at a specific venue.
 * It uses **arrayFilters** to match and modify specific elements in an array within the document.
 *
 * **Search Criteria**:
 * - `slotId`: Identifies the document for updating.
 * - `venue`: The venue within the `slots` array (e.g., "SF001").
 *
 * **Update Operation**:
 * - The `$set` operator updates the `limit` field of the slot for the specified `venue` and `time`.
 * - The `arrayFilters` parameter is used to filter the arrays and update the correct slot.
 *
 * **Array Filters**:
 * - `venue.venue`: Matches the venue (e.g., `"SF001"`).
 * - `time.time`: Matches the time slot (e.g., `"09:00 - 09:15"`).
 *
 * **Query Example**:
 * This query will set the limit of the time slot to 35 for the specified venue and time:
 * ```js
 * db.slots.update(
 *   { slotId: "2024-11-04_2024-11-11_Mock Interview", "slots.venue": "SF001" },
 *   { $set: { "slots.$[venue].slots.$[time].limit": 35 } },
 *   { arrayFilters: [ { "venue.venue": "SF001" }, { "time.time": "09:00 - 09:15" }] }
 * );
 * ```
 *
 * **MongoDB Document Structure**:
 * ```json
 * {
 *   "slots": [
 *     {
 *       "venue": "SF001",
 *       "staffs": ["John", "Doe"],
 *       "slots": [
 *         { "time": "09:00 - 09:15", "limit": 10 }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
/**
```js
db["slots"].findOneAndUpdate(
    {
      "bookers.studentId": ObjectId('672a46fd1fdb7cc295bd6c55'),
      "slotId": "2024-11-04_2024-11-11_Mock Interview",
      "slots.venue": "SF001"
    },
    {
      $set: {
        "bookers.$[id].isBooked": true,
        "bookers.$.bookingTime": `${date.toLocaleDateString()}|${time}`
      },
      $inc: {
        "slots.$[venue].slots.$[time].limit": -1
      }
    },
    {
      arrayFilters: [
        { "venue.venue": "EW112" },
        { "time.time": "10:45 - 11:00" },
        { "id.studentId": ObjectId('672a46fd1fdb7cc295bd6c55') }
      ]
    }
);
```*/