import { IGroupDates, ISlotTimings } from "../Middlewares/function.interfaces";

export const reTransformSlots = (slots: ISlotTimings[]): IGroupDates[] => {
    return slots.reduce((acc: IGroupDates[], curr) => {
      const { date, time, isAvailable } = curr;
      let f = acc.find((e) => e.date === date);
      if (!f) {
        f = { date, availableSlots: [] };
        acc.push(f);
      }
      f.availableSlots.push({ time, isAvailable });
      return acc;
    }, []);
  };