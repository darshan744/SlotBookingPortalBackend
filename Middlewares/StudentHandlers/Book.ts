import {Request , Response } from 'express';
import mongoose ,{ClientSession ,startSession } from 'mongoose';
import { SlotModel} from '../../Models/Slot.model';
import { StudentModel } from '../../Models/Student.model';


/**
 * @desc
 *  Here we are using transaction from mongoose to prevent multiple
 *  user from booking slot at a time which will cause a problem in limit
 */
export const bookSlot = async (req: Request, res: Response): Promise<void> => {
    let { time, date, eventType, studentId, venue, slotId } = req.body;
    eventType = eventType === "Mi" ? "Mock Interview" : eventType === "Si"
        ? "Self Introduction" : "Group Discussion";
    
    console.log("event" , eventType);  
    date = new Date(date);
    date.setFullYear(new Date().getFullYear());
    let user = req.session.user
    // let studentObjectId = await StudentModel.findOne({ studentId: studentId })
    //   .select({ _id: 1 }).exec();
    let studentObjectId : any = new mongoose.Types.ObjectId(user.objectId);
    if (!studentObjectId) {
      res.status(404).json({ message: "Student Not Found" });
    }
    let slot;
    let session:ClientSession | null | undefined = null;
  
    try {
      session = await startSession();
      session.startTransaction();
      slot = await SlotModel.findOneAndUpdate(
        { 
          "bookers.studentId": studentObjectId,
          slotId: slotId,
          "slots.venue": venue,
          "slots.slots" : {
            $elemMatch : {
              time : time,
              limit :{ $gt : 0 }
          }
        }
      },
        {
          $set: {
            "bookers.$[id].isBooked": true,
            "bookers.$[id].bookingDate" : date.toLocaleDateString('en-CA'),
            "bookers.$[id].bookingTime": `${venue}|${time}`,
          },
          $inc: {
            "slots.$[venue].slots.$[time].limit": -1,
          },
        },
        {
          arrayFilters: [
            { "venue.venue": venue },
            { "time.time": time },
            { "id.studentId": studentObjectId },
          ],
        }
      );
      await StudentModel.findOneAndUpdate(
      {
        _id : studentObjectId
      },
    {
      $set:{
        upcomingEvent : date.toString() + time
      }
    })
      if (!slot) {
        res.json({ message: "Just now got booked" , success : false });
        await session.abortTransaction();
        return;
      }
      await session.commitTransaction();
      res.json({ message : "Updated Successfully" ,slot });
    }
    catch (error) {
      if(session) {
        await session.abortTransaction();
      }
      res.status(500).json({ message: "Error in Booking Slot" });
    }
    finally{
      if(session) {
        await  session.endSession();
      }
    }
  };


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