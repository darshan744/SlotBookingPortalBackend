
import { Response, Request } from "express";
import { SlotModel } from "../Models/Slot.model";
import { IRetrivalSlots } from "../Models/interfaces";
import { StudentModel } from "../Models/Student.model";
import mongoose, { ClientSession, ObjectId, startSession } from "mongoose";

/**
 * @route - api/v1/Students/slots/:id/:eventType
 */
export const slots = async (req: Request, res: Response): Promise<void> => {
  console.log("Cookie",req.headers.cookie);
  console.log("Slots" , req.session.id);
  let event = req.params.eventType;
  let studentId: string | null = req.params.id;
  let user = req.session.user;
  console.log("Student Session")
  console.log(user);
  let studentObjectId: any = new mongoose.Types.ObjectId(user.objectId??"")
  console.log("StudentObjctId" , studentObjectId);
  let slotsData: IRetrivalSlots[];
  try {
    // studentObjectId = await StudentModel.findOne(
    //   { studentId: studentId },
    //   { _id: 1 }
    // );   
    if (!studentObjectId) {
      res.status(404).json({ message: "Student Not Found" });
      return;
    }
    if (event !== "Mi" && event !== "Si" && event !== "Gd") {
      res.status(404).json({ message: "Invalid Event Type" });
      return;
    }
    event =
      event === "Mi"  ? "Mock Interview" : event === "Si"
        ? "Self Introduction" : "Group Discussion";
    const agg = [
      {
        $match: {
          eventType: event,
        },
      },
      {
        $project: {
          slotId: 1,
          startDate: 1,
          endDate: 1,
          bookers: {
            $filter: {
              input: "$bookers",
              as: "students",
              cond: {
                $eq: ["$$students.studentId", studentObjectId],
              },
            },
          },
          slots: {
            $map: {
              input: "$slots",
              as: "slot",
              in: {
                venue: "$$slot.venue",
                staff: "$$slot.staffs",
                slots: {
                  $filter: {
                    input: "$$slot.slots",
                    as: "timing",
                    cond: {
                      $gte: ["$$timing.limit", 0],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ];
    slotsData = await SlotModel.aggregate(agg);
    console.log(slotsData);
    if (slotsData.length === 0) {
      console.log("No Slots Found");
      res.json({ success: false, message: "No Slots Found" });
      return;
    }
    else if(slotsData[0].bookers.length === 0) {
      console.log("No slots Available")
      res.json({success : true, message : "No slots Available for Now"})
      return;
    } 
    else if (slotsData[0].bookers[0].isBooked) {
      const bookers = slotsData[0].bookers[0];
      console.log("Already Booked");  
      res.json({ success: true, message: "Already Booked",
        data: { bookingTime: bookers.bookingTime.split("|")[1], bookingDate: bookers.bookingDate,
        },
      });
    } else {
      console.log("SLots Found");
      res.json({ success: true, message: "Slot Retrieved Successfully",
        data: { startDate: slotsData[0].startDate, endDate: slotsData[0].endDate, slots: slotsData[0].slots,
        },
      });
    }
  } catch (err: any) {
    res.status(500).json({ success : false , message: "Error finding student", error: err.message });
  }
};
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
 * @route -api/v1/Students/eventRestult/:id
 */
export const getEventResult = async (req : Request , res : Response) : Promise<void> => {
  let studentId = req.params.id;
  try{
    const studentEventResult = await StudentModel.findOne({studentId : studentId},{EventHistory:1 , _id:0});
    res.json({success : true , data : studentEventResult});
  }
  catch(e) {
    console.log(e);
    res.json({success : false , message : "Cannot Retreive Event Result"});
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
```
*/

/**
 * **Explanation**:
 * This query updates the booking status for a specific student and decreases the available slot limit.
 *
 * **Search Criteria**:
 * - `studentId`: Used to identify the student booking the slot.
 * - `slotId`: Identifies the event (e.g., "Mock Interview").
 * - `venue`: Matches the venue where the event is hosted.
 *
 * **Update Operation**:
 * - The `$set` operator marks the student as booked and records the `bookingTime`.
 * - The `$inc` operator decreases the `limit` of the time slot.
 *
 * **Array Filters**:
 * - `venue.venue`: Matches the specific venue (e.g., `"EW112"`).
 * - `time.time`: Matches the time slot (e.g., `"10:45 - 11:00"`).
 * - `id.studentId`: Filters based on the student's ID.
 *
 * **Query Example**:
 * This query will update the booking status and decrease the available slot limit by 1:
 * ```js
 * db.slots.findOneAndUpdate(
 *   {
 *     "bookers.studentId": ObjectId('672a46fd1fdb7cc295bd6c55'),
 *     "slotId": "2024-11-04_2024-11-11_Mock Interview",
 *     "slots.venue": "SF001"
 *   },
 *   {
 *     $set: {
 *       "bookers.$[id].isBooked": true,
 *       "bookers.$.bookingTime": `${date.toLocaleDateString()}|${time}`
 *     },
 *     $inc: {
 *       "slots.$[venue].slots.$[time].limit": -1
 *     }
 *   },
 *   {
 *     arrayFilters: [
 *       { "venue.venue": "EW112" },
 *       { "time.time": "10:45 - 11:00" },
 *       { "id.studentId": ObjectId('672a46fd1fdb7cc295bd6c55') }
 *     ]
 *   }
 * );
 * ```
 */

/**
```js
const agg = [
      {
        $match: {
          eventType: 'Mock Interview'
        }
      },
      {
        $project: {
          bookers: {
            $filter: {
              input: '$bookers',
              as: 'students',
              cond: {
                $eq: ['$$students.studentId', new ObjectId('672a46fd1fdb7cc295bd6c51')]
              }
            }
          },
          slots: {
            $map: {
              input: '$slots',
              as: 'slot',
              in: {
                venue: '$$slot.venue',
                staff: '$$slot.staffs',
                slots: {
                  $filter: {
                    input: '$$slot.slots',
                    as: 'timing',
                    cond: {
                      $gte: ['$$timing.limit', 0]
                    }
                  }
                }
              }
            }
          }
        }
      }
    ];
  ```
  */

/**
 * **Explanation**:
 * This aggregation query is used to retrieve the list of bookers for a specific event type, filtering for a particular `studentId`.
 * It also filters the `slots` array, ensuring that only slots with a `limit` greater than or equal to 0 are returned.
 *
 * **$match**:
 * - Filters the documents based on the `eventType` field.
 *
 * **$project**:
 * - The `bookers` array is filtered by `studentId` using `$filter`.
 * - The `slots` array is mapped to filter only those slots with available `limit`.
 *
 * **Query Example**:
 * This aggregation will return the `bookers` and `slots` that match the filtering criteria:
 * ```js
 * db.slots.aggregate([
 *   { $match: { eventType: 'Mock Interview' } },
 *   { $project: {
 *       bookers: { $filter: { input: '$bookers', as: 'students', cond: { $eq: ['$$students.studentId', studentId] } } },
 *       slots: { $map: { input: '$slots', as: 'slot', in: { venue: '$$slot.venue', staff: '$$slot.staffs' } } }
 *   }}
 * ]);
 * ```
 */

/**
 * **Initial Query**
 * ```js
 * db.slots.update({slotId:"2024-11-04_2024-11-11_Mock Interview",
 * "slots.venue":"SF001"},{ $set : { "slots.$[venue].slots.$[time].limit" : 35 } }
 *,{ arrayFilters : [ { "venue.venue" : "SF001"} , { "time.time":"09:00 - 09:15"}] });
 * ```
 *
 * **Explanation**
 * - Here we are searching with help of array filters and updating the limit of the slot,
 * - This query will search for document that is matching the slotId and venue ,
 * - For Setting the value we are using arrayFilters of mongodb command,
 * - Here in $set the `slots.$[venue].slots.$[time].limit` is the path of the value that we want to update,
 * - **The query definition :**
 * - slots : is the property for which it contains the venue and slots array,
 * -`$[venue] : this matches with the venue that we mentioned in arrayFilters
 * -`$[time] : this matches with the time that we mentioned in arrayFilters
 *
 * **Description :**
 * The venue in the $set will check for arrayFilters in which it matches with
 * `venue.venue` definition and then it will check for corresponding slots(time and limit)
 *  array in which it again checks for arrayFilters that matches with `time.time` definition
 *  and then it will update the limit of the slot.
 *
 *
 * **Model of the data Stored**
 *  The structure for the slots property is as follows :
 *  `slots : venue : string[] , staffs : string[] , slots : { time : string , limit : number }`
 *
 * **ProgrammingLogic**
 * - The programming logic for the above query is as follows :
 * ```js
 *     for (const slot of slots) {
 *       if (slots.venue === "SF001") {
 *         for (const time of slots.slots) {
 *          if (time.time === "09:00 - 09:15") {
 *             time.limit = 35;
 *          }
 *        }
 *      }
 *     }
 * ```
 */
/**
 * ```js
 * db["slots"].findOneAndUpdate (
 *{
 *"bookers.studentId":ObjectId('672a46fd1fdb7cc295bd6c55'),
 *"slotId" : "2024-11-04_2024-11-11_Mock Interview",
 *"slots.venue":"SF001"
 *},
 *{
 *$set : {
 *"bookers.$[id].isBooked" : true,
 *"bookers.$.bookingTime": `${date.toLocaleDateString()}|${time}`
 *}, $inc : {
 *"slots.$[venue].slots.$[time].limit": -1
 *}
 * },
 *{
 *arrayFilters : [ { "venue.venue":"EW112"} , {"time.time" : "10:45 - 11:00"} ,{
 *"id.studentId" : ObjectId('672a46fd1fdb7cc295bd6c55')}]
 *}
 *)
 * ```
 * **Comment**
 * The above query is same as before but we are just updating the limit
 * and the status of the booking for the student
 */


/**
 * ```js
 * const agg = [
 * {
 *  '$match': {
 *    'eventType': 'Mock Interview'
 *  }
 *}, {
 *  '$project': {
 *    'bookers': {
 *      '$filter': {
 *        'input': '$bookers',
 *        'as': 'students',
 *        'cond': {
 *          '$eq': [
 *            '$$students.studentId', new ObjectId('672a46fd1fdb7cc295bd6c51')
 *          ]
 *        }
 *      }
 *    },
 *    'slots': {
 *      '$map': {
 *        'input': '$slots',
 *        'as': 'slot',
 *        'in': {
 *          'venue': '$$slot.venue',
 *          'staff': '$$slot.staffs',
 *          'slots': {
 *            '$filter': {
 *              'input': '$$slot.slots',
 *              'as': 'timing',
 *              'cond': {
 *                '$gte': [
 *                  '$$timing.limit', 0
 *                ]
 *              }
 *            }
 *          }
 *        }
 *      }
 *     }
 *   }
 * }
 *];
 * ```
 * **Description:**
 * - The above query is used to for querying i.e retrieving
 * - We cant use aggregate for updating the document
 * - In project it is used to set the fields that we want to retrieve
 * - Here we are retrieving only the bookers and slots array alone but in the actual query
 *  other fields we just put `field`: 1,
 * - In bookers array we are filtering the bookers array with the studentId that we are searching for
 * - In $filter the `input` is the array that we are filtering and `as` is the alias for the array
 * - that we are filtering and we have to use the alias name in the `cond` field
 * - In `cond` we are checking for the condition that we are filtering the array with in here we are checking
 * - for equality of the studentId with the studentId that we are searching for..
 *
 */
/*---------------Bookers only---------------*/
/**
 * ```js
 * const agg = [
  {
    $match: {
      eventType: event === "Mi" ? "Mock Interview" :
          event === "Si" ? "Self Introduction" : "Group Discussion"
    },
  },
  {
    $project: {
      bookers: {
        $filter: {
          input: "$bookers",
          as: "students",
          cond: {
            $eq: ["$$students.studentId", studentObjectId?._id]
          }
        }
      }
    }
  }
]
 ```*/
