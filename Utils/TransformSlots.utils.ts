import { IReGroupDate, ISlotTimings } from "../Middlewares/function.interfaces";

export const transformSlots: (schedule: IReGroupDate[]) => ISlotTimings[] = (
    schedule: IReGroupDate[]
  ): ISlotTimings[] => {
    const result: { date: string; time: string; isAvailable: string }[] = [];
    schedule.forEach((e) => {
      e.slots.forEach((slot) =>
        result.push({
          date: e.date,
          time: slot.time,
          isAvailable: slot.isAvailable,
        })
      );
    });
    return result.filter((e) => e.isAvailable === "unmodified");
  };