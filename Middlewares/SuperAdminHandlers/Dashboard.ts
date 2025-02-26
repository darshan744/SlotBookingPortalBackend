import {Request , Response } from "express";
import {SlotModel} from "../../Models/Slot.model";
import {StudentModel} from "../../Models/Student.model";
import { IEvents, ISlot, IStudent, IStudentEventResult} from "../../Models/interfaces";
import { EventModel } from "../../Models/Settings.model";

export async function dashboard (req: Request, res: Response) {
    try {
        //events list 
        const eventCursor = await SlotModel.find({} , {_id:0 , bookers:0 , slots : 0}).lean<ISlot[]>()

        //get Events;
        const listOfEventsCursor = await EventModel.find({} , {_id : 0 , Name : 1}).lean<IEvents[]>();

        const listOfEvents = listOfEventsCursor.map(e=>e.Name);
        //students list
        let studentCursor  = await StudentModel.find({} ,
            {_id:0 , password : 0 , userType:0,}).lean<IStudent[]>();

        if(!studentCursor) return;

        //for displaying the number of events card
        let groupedEvents = groupEvents(eventCursor);
        
        //grouping so that the event history
        //is taken as for average 
        // id name dept year , eventhistory with key : event name , avg : average of that event
        let students  = reduceStudents(studentCursor);

        const dashboardData = {
          totalEvents: eventCursor.length,
          groupedEvents,
          events: eventCursor,
          students,
          listOfEvents,
        };
        res.json(dashboardData);
    }catch (e : any) {
        res.status(500).json({error: e.message , success : false});
    }
}
function reduceStudents (studentCursor: IStudent[]) {
    return studentCursor.map(e=> ({
            id : e.id , name : e.name , department:e.department,year:e.year,
            eventHistory :  e.EventHistory.length > 0 ? Object.entries(e.EventHistory.reduce(
                (acc : any, element :any) => {
                    (acc[element['eventType']] = acc[element['eventType']] || []).push(element)
                    return acc;
                },{})).map((e : any)=> ({ key : e[0] , avg : calculateAverage(e[1])})) : []
        }
    ))
}

function groupEvents (eventCursor : ISlot[]) : {
    event:string;
    numberOfEvents:number;
}[]  {
    let groupedEvents = eventCursor.reduce(
        (acc : any, event : ISlot) => {
            (acc[event['eventType']] = acc[event['eventType']] || []).push(event)
            return acc;
        },{})
    groupedEvents = Object.entries(groupedEvents)
    groupedEvents = groupedEvents.map((e : any)=>({event : e[0] , numberOfEvents :  e[1].length}))
    return groupedEvents;
}

function calculateAverage (arr : IStudentEventResult[]) {
    let avg = 0;
    for(const item of arr) {
        avg += item.marks
    }
    return avg/arr.length;
}