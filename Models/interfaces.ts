/* -------------------------Student Side Interfaces--------------------------------------  */

interface StudentEventResult {
    /* Id to the slot that was booked and the result will be obtained when the instructor enters it
    from there the details may be obtained this is done with the unique id generated  */
    id : string, 
    event : String,
    isPresent : boolean
    marks : number,
    remarks : string,
}   



interface Student { 
    /* General Information of student
     with history of events atttended  */
    id : string, 
    name : string,
    dept : string,
    email : string,
    resume ?: File,
    studentEvents : StudentEventResult[]
    /* This points to the result that is obtained keeping it as reference because Admin and SuperAdmin can review this */
}

/* -------------------------------------------------------------------------------------------------------------------------------------*/

/* ----------------------------------------------------Staff Informations---------------------------------------------------------------*/



interface Staff {
    /* General Information of faculties for any queries  */
    id : string,
    name : string,
    dept : string,
    phNo : string,
    email : string,
    eventHistory : string[] /* Points to their history of events attended so that we can check for any Queries raised  */
}



/* For Both Sending Request and Receving Response will be of the below Type */
interface Availablility {
    instructorId : Staff["id"],
    availableSlots : SlotGeneratedForRequest[]
}



/*===================================================================================================================*/

/*==========================================SuperAdmin============================== */

interface Slot  {
    id : string, // Date:SLOTIME_VENUE
    date : Date,
    time : string,
    eventType : string //Mi SI GD
    venue : Venues[]
    bookers : Booking[] // points to all the student of the applied category 
}
interface Booking{
    /* This interface helps in identifying the Booking status of the student so that we can group the students */
    studentId : string,/* Points to the each student */
    isBooked : boolean // Yes= booked no = not booked default not booked if booked turns true;
    bookingTime : string
}
interface Venues {
    venue : string, // Mandatory bcoz even in MI or SI is done in faculty place the place is to be intimated 
    instructors : Staff[], //This points to the id of that staff that is selected availability will be recieved before hand
    /* Single Venue Many instructors for MI and SI 
    Singe venue one instructor for GD  */
    limit : number // or  //limit ?: number 
    /**  will consided might not implement :  optional only for MI or SI 
    because if we consider MI and SI it may happen in faculty place where limit is 1 */
}

interface SlotGeneratedForRequest {
    eventType : string,
    date : Date,
    startTIme : string,
    endTime : string,
    isAvailable : boolean
}