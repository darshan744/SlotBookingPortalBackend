import { IBookingStatus, IVenues2 } from "../../../Models/interfaces";

export class Slot {
  slotId: string;
  startDate: Date;
  endDate: Date;
  eventType: string;
  year: string;
  slots: IVenues2[]; // List of venues with accepted slots
  bookers: IBookingStatus[]; // List of booking statuses for each student

  constructor(
    slotId: string,
    startDate: string,
    endDate: string,
    eventType: string,
    year: string,
    slots: IVenues2[],
    bookers: IBookingStatus[]
  ) {
    this.slotId = slotId;
    const startDateSplit: string[] = startDate.split("/");
    const endDateSplit: string[] = endDate.split("/");
    //when using the default material.angular date picker's date string when converted to Date Object we got previous day
    //this is due to js' timezone handling -> js converts the date to a UTC standart date object
    //bcoz js uses UTC defaultly so we convert the default date string in frontend to dd/mm/yyyy
    //then split'em up we get [dd,mm,yyyy] then using js' Date.UTC() which will set the Time zone to 000000
    //hence the date will be in the same day;
    this.startDate = new Date(
      new Date(
        Date.UTC(
          parseInt(startDateSplit[2]),
          parseInt(startDateSplit[1]) - 1,
          parseInt(startDateSplit[0])
        )
      )
    );
    this.endDate = new Date(
      new Date(
        Date.UTC(
          parseInt(endDateSplit[2]),
          parseInt(endDateSplit[1]) - 1,
          parseInt(endDateSplit[0])
        )
      )
    );
    this.eventType = eventType;
    this.year = year;
    this.slots = slots;
    this.bookers = bookers;
  }
}
export class GetSlot {
  slotID: string;
  startDate: Date;
  endDate: Date;
  eventType: string;
  year: string;

  constructor(
    slotId: string,
    startDate: Date,
    endDate: Date,
    eventType: string,
    year: string
  ) {
    this.slotID = slotId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.eventType = eventType;
    this.year = year;
  }
}