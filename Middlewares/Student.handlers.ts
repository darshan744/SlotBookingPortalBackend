
import { Response, Request } from "express";
import { SlotModel } from "../Models/Slot.model";
import { IRetrivalSlots } from "../Models/interfaces";
import { StudentModel } from "../Models/Student.model";

export const slots = async (req: Request, res: Response): Promise<void> => {
  let event = req.params.eventType;
  let studentId: string | null = req.params.id;
  let studentObjectId: any;
  let slotsData: IRetrivalSlots[];
  try {
    studentObjectId = await StudentModel.findOne(
      { studentId: studentId },
      { _id: 1 }
    );
    studentObjectId = studentObjectId?._id;
    console.log(studentObjectId);
    if (!studentObjectId) {
      res.status(404).json({ message: "Student Not Found" });
      return;
    }
    if (event !== "Mi" && event !== "Si" && event !== "Gd") {
      res.status(404).json({ message: "Invalid Event Type" });
      return;
    }
    event =
      event === "Mi"
        ? "Mock Interview"
        : event === "Si"
        ? "Self Introduction"
        : "Group Discussion";
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
    if (slotsData.length === 0) {
      res.json({ success: false, message: "No Slots Found" });
      return;
    }
    if (slotsData.length === 0) {
      console.log("No Slots Found");
      res.json({ success: false, message: "No Slots Found" });
      return;
    } else if (slotsData[0].bookers[0].isBooked === true) {
      const bookers = slotsData[0].bookers[0];
      console.log("Already Booked");  
      res.json({
        success: true,
        message: "Already Booked",
        data: {
          bookingTime: bookers.bookingTime.split("|")[1],
          bookingDate: bookers.bookingTime.split("|")[0],
        },
      });
    } else {
      console.log("SLots Found");
      res.json({
        success: true,
        message: "Slot Retrieved Successfully",
        data: {
          startDate: slotsData[0].startDate,
          endDate: slotsData[0].endDate,
          slots: slotsData[0].slots,
        },
      });
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error finding student", error: err.message });
  }
};

export const bookSlot = async (req: Request, res: Response): Promise<void> => {
  let { time, date, eventType, studentId, venue, slotId } = req.body;
  console.log(req.body);
  eventType =
    eventType === "Mi"
      ? "Mock Interview"
      : eventType === "Si"
      ? "Self Introduction"
      : "Group Discussion";
  date = new Date(date);
  date.setFullYear(new Date().getFullYear());
  let studentObjectId = await StudentModel.findOne({ studentId: studentId })
    .select({ _id: 1 })
    .exec();
  if (!studentObjectId) {
    res.status(404).json({ message: "Student Not Found" });
  }
  let slot;

  try {
    slot = await SlotModel.findOneAndUpdate(
      {
        "bookers.studentId": studentObjectId,
        slotId: slotId,
        "slots.venue": venue,
      },
      {
        $set: {
          "bookers.$[id].isBooked": true,
          "bookers.$[id].bookingTime": `${date.toLocaleDateString()}|${time}`,
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
    res.json({ slot });
  } catch (error) {
    res.status(500).json({ message: "Error in Booking Slot" });
  }
};

/*
  db.slots.update({slotId:"2024-11-04_2024-11-11_Mock Interview",
   "slots.venue":"SF001"},{ $set : { "slots.$[venue].slots.$[time].limit" : 35 } }
 ,{ arrayFilters : [ { "venue.venue" : "SF001"} , { "time.time":"09:00 - 09:15"}] });
 

 * Here we are searching with help of arrayfilters and updating the limit of the slot,
 * This query will search for document that is matching the slotId and venue ,
 * For Setting the value we are using arrayFilters of mongodb command,
 * Here in $set the `slots.$[venue].slots.$[time].limit` is the path of the value that we want to update,
 * The query definition : 
 * slots : is the property for which it contains the venue and slots array,
      `$[venue] : this matches with the venue that we mentioned in arrayFilters 
      `$[time] : this matches with the time that we mentioned in arrayFilters
  
 * Description : 
      The venue in the $set will check for arrayFilters in which it matches with 
      `venue.venue` defintion and then it will check for corresponding slots(time and limit)
      array in which it again checks for arrayFilters that matches with `time.time` definition
      and then it will update the limit of the slot.
      
      The structure for the slots property is as follows : 
       slots : venue : string[] , staffs : string[] , slots : { time : string , limit : number }

       The programming logic for the above query is as follows :
          for (const slot of slots) {
            if(slots.venue === "SF001") {
              for(const time of slots.slots) {
                if(time.time === "09:00 - 09:15") {
                  time.limit = 35;
                }
              }
            }
          }
 */
/**
 * db["slots"].findOneAndUpdate ( 
{
	"bookers.studentId":ObjectId('672a46fd1fdb7cc295bd6c55'),
	"slotId" : "2024-11-04_2024-11-11_Mock Interview",
	"slots.venue":"SF001"
},
{
		$set : {
		      "bookers.$[id].isBooked" : true,
          "bookers.$.bookingTime": `${date.toLocaleDateString()}|${time}`
    }, $inc : {
            "slots.$[venue].slots.$[time].limit": -1
        }
},
{
		arrayFilters : [ { "venue.venue":"EW112"} , {"time.time" : "10:45 - 11:00"} ,{ 
		"id.studentId" : ObjectId('672a46fd1fdb7cc295bd6c55')}]
}
)
 *
 * The above query is same as before but we are just updating the limit 
 * and the their status of the booking for the student 
 */

/*
const agg = [
  {
    '$match': {
      'eventType': 'Mock Interview'
    }
  }, {
    '$project': {
      'bookers': {
        '$filter': {
          'input': '$bookers', 
          'as': 'students', 
          'cond': {
            '$eq': [
              '$$students.studentId', new ObjectId('672a46fd1fdb7cc295bd6c51')
            ]
          }
        }
      }, 
      'slots': {
        '$map': {
          'input': '$slots', 
          'as': 'slot', 
          'in': {
            'venue': '$$slot.venue', 
            'staff': '$$slot.staffs', 
            'slots': {
              '$filter': {
                'input': '$$slot.slots', 
                'as': 'timing', 
                'cond': {
                  '$gte': [
                    '$$timing.limit', 0
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
];
 * The above query is used to for querying i.e retrieving 
 * We cant use aggregate for updating the document
 * In project it is used to set the fields that we want to retrieve
 * Here we are retreiving only the bookers and slots array alone but in the actual query 
 * other fields we just put `field`: 1,
 * In bookers array we are filtering the bookers array with the studentId that we are searching for
 * In $filter the `input` is the array that we are filtering and `as` is the alias for the array 
 * that we are filtering and we have to use the alias name in the `cond` field
 * In `cond` we are checking for the condition that we are filtering the array with in here we are checking
 * for equality of the studentId with the studentId that we are searching for.. 
 * 
*/
/*---------------Bookers only---------------*/
/*  const agg = [
  {
    $match: {
       eventType : event === "Mi" ? "Mock Interview" :
        event === "Si" ? "Self Introduction" : "Group Discussion"
    },
  },
  {
     $project: {
        bookers : {
          $filter : {
            input : "$bookers",
            as :  "students",
            cond : {
              $eq : ["$$students.studentId" , studentObjectId?._id]
            }
          }
        }
      }
  	}
    ]*/
