const staff = require('../../Models/SuperAdmin')
exports.getAllStaff =  async (req , res , next)=>{
    try {
        const staffs =  await staff.StaffModel.find({},'name');
        res.json({
            success:true,
            staffs
        })
    }
    catch(e) {
        res.json({success:false})
    }
}

exports.insertManyStaffs = async(req,res,next)=>{
    try {   
        const staffs = req.body;
        if(!Array.isArray(staffs)) {
            return res.status(400).json({success:false,message : 'Invalid INput '})
        }
        await staff.StaffModel.insertMany(staffs);
        res.json({success:true})
    }catch(e) {
        res.json({success:false , message:'error Occured in inserting objects array'})
        
    }
}

exports.requestAvailability = async (req , res , next )=> {
    
}
