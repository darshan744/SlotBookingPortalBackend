exports.converToDate = (date)=>{
    var startdate = date.split('T')[0].split('-');
    var years = startdate[0];
    var months = startdate[1];
    var date = startdate[2];
    return `${years}-${months.padStart(2, 0)}-${date.padStart(2, 0)}`;
}

exports.assignToDate = (startDateStr, endDateStr, slots)=>{
    let resultSlot /**type slot*/ = [];
    let startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);
    console.log("assignTODate : ", startDate, endDate)
    while (startDate <= endDate) {
        if (startDate.getDay() !== 0) {
            resultSlot.push({ date: startDate.toString(), slots: slots });
        }
        startDate.setDate(startDate.getDate() + 1);
    }
    console.log(" AssignToDate " + resultSlot);
    return resultSlot;
}
exports.assignToStaff = (staffs, slots)=>{
    const availabilityStaffArray = [];
    staffs.forEach((staff) => {
        availabilityStaffArray.push({ instructorId: staff._id, 
            availableSlots: slots.map(slot => ({
                date : slot.date,
                slots : slot.slots.map(eachSlot => ({
                    time : eachSlot,
                    isAvailable : false
                }))
            })) })
    });
    console.log(" assignToStaff " + availabilityStaffArray);
    return availabilityStaffArray;
}