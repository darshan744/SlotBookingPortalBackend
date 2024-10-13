const {StaffModel , StudentModel} = require('../Models/SuperAdmin')

    exports.auth = async (request , response)=>{
        const obj = request.body
        console.log(obj.rollNo);
        const isStaff = await StaffModel.findOne({_id : obj.rollNo});
        const isStudent = await StudentModel.findOne(request.body);

        if(isStaff) {
            console.log(isStaff);
            response.status(200).json({ role : 'staff',user : isStaff});
        }
        else if(isStudent) {
            console.log(isStudent);
            
            response.status(200).json({ role : 'student' ,user : isStudent});
        }
        else {
            response.status(404).json({message : 'User Not Found'});
        }
    }