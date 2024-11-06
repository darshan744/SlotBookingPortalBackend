export const converToDate = (date: string): string => {
    const startdate: string[] = date.split('T')[0].split('-');
    const years: string = startdate[0];
    const months: string = startdate[1];
    const day: string = startdate[2];
    return `${years}-${months.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export const assignToDate = (startDateStr: string, endDateStr: string, slots: any[]): { date: string; slots: any[] }[] => {
    const resultSlot: { date: string; slots: any[] }[] = [];
    let startDate: Date = new Date(startDateStr);
    const endDate: Date = new Date(endDateStr);
    while (startDate <= endDate) {
        if (startDate.getDay() !== 0) {
            resultSlot.push({ date: startDate.toLocaleDateString("en-CA", { year: 'numeric', month: '2-digit', day: '2-digit' }), slots: slots });
        }
        startDate.setDate(startDate.getDate() + 1);
    }
    return resultSlot;
}

export const assignToStaff = (staffs: { _id: string }[], slots: any[]): { instructorId: string; availableSlots: { date: string; slots: { time: any; isAvailable: string }[] }[] }[] => {
    const availabilityStaffArray: { instructorId: string; availableSlots: { date: string; slots: { time: any; isAvailable: string }[] }[] }[] = [];
    staffs.forEach((staff) => {
        availabilityStaffArray.push({
            instructorId: staff._id,
            availableSlots: slots.map(slot => ({
                date: slot.date,
                slots: slot.slots.map((eachSlot : any) => ({
                    time: eachSlot,
                    isAvailable: 'unmodified',
                }))
            }))
        })
    });
    return availabilityStaffArray;
}

export const generateHoursForStaffs = (): string[] => {
    const resultSlots: string[] = [];
    const minutesToTime = (minutes: number): string => {
        const hours: number = Math.floor(minutes / 60);
        const min: number = Math.floor(minutes % 60);
        return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    }
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    let startTime: string = '8:45', endTime: string = '16:30';
    let startMinutes: number = timeToMinutes(startTime), endMinutes: number = timeToMinutes(endTime);
    const hr: number = 60;
    while (startMinutes <= endMinutes) {
        let timeInterval: string = `${minutesToTime(startMinutes)} - ${minutesToTime(startMinutes + hr)}`;
        if (timeInterval !== '12:45 - 13:45')
            if (timeInterval === '15:45 - 16:45')
                resultSlots.push('15:45 - 16:30');
            else
                resultSlots.push(timeInterval);

        startMinutes += hr;
    }
    return resultSlots;
}

export const reTransformSlots = (slots: { date: string; time: string; isAvailable: string }[]): { date: string; availableSlots: { time: string; isAvailable: string }[] }[] => {
    return slots.reduce((acc: { date: string; availableSlots: { time: string; isAvailable: string }[] }[], curr) => {
        const { date, time, isAvailable } = curr;
        let f = acc.find(e => e.date === date);
        if (!f) {
            f = { date, availableSlots: [] };
            acc.push(f);
        }
        f.availableSlots.push({ time, isAvailable });
        return acc;
    }, []);
}

export const transformSlots = (schedule: { date: string; slots: { time: string; isAvailable: string }[] }[]): { date: string; time: string; isAvailable: string }[] => {
    const result: { date: string; time: string; isAvailable: string }[] = [];
    schedule.forEach(e => {
        e.slots.forEach(slot => result.push(({ date: e.date, time: slot.time, isAvailable: slot.isAvailable })));
    })
    return result.filter(e => e.isAvailable === 'unmodified');
}