const {StudentModel} = require('../Models/Student.model')
const StaffModel = require('../Models/Staff.model');
exports.auth = async (request, response) => {
    const id = request.body.rollNo

    const isStaff = await StaffModel.findOne({ staffId: id });
    const isStudent = await StudentModel.findOne({ _id: id });
    if (isStaff) {
        console.log('isStaff');
        response.status(200).json({ role: 'staff', user: isStaff });
    }
    else if (isStudent) {
        console.log('isStudent');

        response.status(200).json({ role: 'student', user: isStudent });
    }
    else {
        console.log('NOT A USER')
        response.status(404).json({ message: 'User Not Found' });
    }
}