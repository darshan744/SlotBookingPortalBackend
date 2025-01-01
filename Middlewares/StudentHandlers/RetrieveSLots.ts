import { Request , Response } from "express";
import mongoose from 'mongoose';
import { IRetrievalSlots } from "../../Models/interfaces";
import { SlotModel } from "../../Models/Slot.model";
import { EventModel } from "../../Models/Settings.model";
/**
 * @route - api/v1/Students/slots/:id/:eventType
 */
export const slots = async (req: Request, res: Response): Promise<void> => {
    let event = req.params.eventType;
    const year = req.query.year;
    console.log(year ,",",   event);
   event = event.replace('_',' ')
    let user = req.session.user;
    let studentObjectId = new mongoose.Types.ObjectId(user.objectId??"")

    try {
      if (!studentObjectId) {
        res.status(404).json({ message: "Student Not Found" });
        return;
      }
      let slotsData = await SlotModel.findOne({eventType : event , year : year}).lean();
      if(!slotsData) {
          res.json({ message: "No Data Found" , data : null});
          return;
      }
      if(slotsData) {
        slotsData.bookers = slotsData.bookers.filter(booker => booker.studentId.toString() === studentObjectId.toString());
      }
      console.log(slotsData);
      if(slotsData.bookers[0].isBooked) {
          res.json({success : true , message : "Already Booked" , data : slotsData.bookers[0]})
          return;
      }
      res.json({message : 'data' , data : slotsData});
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
 * This aggregation query is used to retrieve the list of bookers for a specific event type, filtering for a particular
 * `studentId`. It also filters the `slots` array, ensuring that only slots with a `limit` greater than or equal to 0
 * are returned.
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
 *       bookers: { $filter: { input: '$bookers', as: 'students', cond: { $eq: ['$$students.studentId', studentId] } }
 * }, slots: { $map: { input: '$slots', as: 'slot', in: { venue: '$$slot.venue', staff: '$$slot.staffs' } } }
 *   }}
 * ]);
 * ```
 */
