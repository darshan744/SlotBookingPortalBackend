import { Request , Response } from "express";
import mongoose from 'mongoose';
import { IRetrivalSlots } from "../../Models/interfaces";
import { SlotModel } from "../../Models/Slot.model";
import { eventModel } from "../../Models/Event.model";
/**
 * @route - api/v1/Students/slots/:id/:eventType
 */
export const slots = async (req: Request, res: Response): Promise<void> => {
    console.log("Cookie",req.headers.cookie);
    console.log("Slots" , req.session.id);
    let event = req.params.eventType;
   event = event.replace('_',' ');
    console.log(event);
    let studentId: string | null = req.params.id;
    let user = req.session.user;
    console.log("Student Session")
    console.log(user);
    let studentObjectId: any = new mongoose.Types.ObjectId(user.objectId??"")
    console.log("StudentObjctId" , studentObjectId);
    let slotsData: IRetrivalSlots[];
    try {
      if (!studentObjectId) {
        res.status(404).json({ message: "Student Not Found" });
        return;
      }
      const agg = [{
          $match: {
            eventType: event,
            endDate:{
              $gte:[new Date() , "$startDate"]
            }
          },
        },{
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
          data: { bookingTime: bookers.bookingTime.split("|")[1],
            bookingVenue:bookers.bookingTime.split("|")[0],
          bookingDate: bookers.bookingDate},
        });
      } else {
        console.log("SLots Found");
        res.json({ success: true, message: "Slot Retrieved Successfully",
          data: { startDate: slotsData[0].startDate, endDate: slotsData[0].endDate,
          slots: slotsData[0].slots,},
        });
      }
    } catch (err: any) {
      res.status(500).json({ success : false , message: "Error finding student", error: err.message });
    }
  };
  

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
