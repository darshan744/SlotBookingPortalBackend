
exports.converToDate = (date) => {
    var startdate = date.split('T')[0].split('-');
    var years = startdate[0];
    var months = startdate[1];
    var date = startdate[2];
    return `${years}-${months.padStart(2, 0)}-${date.padStart(2, 0)}`;
}

exports.assignToDate = (startDateStr, endDateStr, slots) => {
    let resultSlot = [];
    let startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);
    // console.log("assignTODate : ", startDate, endDate)
    while (startDate <= endDate) {
        if (startDate.getDay() !== 0) {
            resultSlot.push({ date: startDate.toLocaleDateString("en-CA",{year:'numeric',month:'2-digit',day:'2-digit'}), slots: slots });
        }
        startDate.setDate(startDate.getDate() + 1);
    }
    // console.log(" AssignToDate " + resultSlot);
    return resultSlot;
}

exports.assignToStaff = (staffs, slots) => {
    const availabilityStaffArray = [];
    staffs.forEach((staff) => {
        availabilityStaffArray.push({
            instructorId: staff._id,
            availableSlots: slots.map(slot => ({
                /*slot contains date and slots array
                which has slot timing and a boolean property  time : 9:00 - 9:15 isAvailable : false */
                date: slot.date,
                slots: slot.slots.map(eachSlot => ({
                    time: eachSlot,
                    isAvailable: 'unmodified',
                }))
            }))
        })
    });
    // console.log(" assignToStaff " + availabilityStaffArray);
    return availabilityStaffArray;
}

exports.generateHoursForStaffs = () => {
    const resultSlots = [];
    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const min = Math.floor(minutes % 60);
        return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
    }
    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    let startTime = '8:45', endTime = '16:30';
    let startMinutes = timeToMinutes(startTime), endMinutes = timeToMinutes(endTime);
    const hr = 60;
    while(startMinutes <= endMinutes) {
        let timeInterval = `${minutesToTime(startMinutes)} - ${minutesToTime(startMinutes + hr)}`
        if(timeInterval !== '12:45 - 13:45' )
            if(timeInterval === '15:45 - 16:45')
                resultSlots.push('15:45 - 16:30');
            else 
                resultSlots.push(timeInterval)
        
        startMinutes += hr;
    }
    return resultSlots;
}

exports.reTransformSlots = (slots)=>{
    return slots.reduce( (acc , curr) => {
       const {date , time , isAvailable} = curr; 
       let f = acc.find(e=> e.date === date);
       if(!f) {
        f = {date , availableSlots : []};
        acc.push(f);
       }
       f.availableSlots.push({time , isAvailable});
       return acc;
    },[])
}

exports.transformSlots = (schedule)=>{
    const result = [];
    schedule.forEach(e => {
        e.slots.forEach(slot => result.push(({date : e.date , time : slot.time , isAvailable : slot.isAvailable})));
    })
    return result.filter(e => e.isAvailable === 'unmodified');
}

