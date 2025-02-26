import { Request , Response } from "express";

import { queryModel } from '../../Models/Query.model';
import { IQuery } from "../../Models/interfaces";

export const postStudentQuery = async(req : Request , res : Response)=> {
    //student id
    const id = req.session.user.id;
    const query = req.body;
    const uniqueSuffix = new Date().getTime();
    const queryId = `${id}_${new Date().toDateString()}_${uniqueSuffix}`;
    try {
        const queryObj = new queryModel({
            title:query.title , 
            description:query.description , 
            raiserId:id, 
            queryId : queryId,
            status:'Pending'
        });
        await queryObj.save();
        res.status(200).json({message : "Query Posted" });
    }catch(e : any){
        res.status(500).json({message:"Error Occured" , error : e.message});
    }
}

export const getStudentSpecificQueries = async(req : Request , res:Response)=>{
    try {
        //student specifc queries
        const studentId = req.session.user.id;
        //lean is used to convert mongoose document to plain js object
        const queries = await queryModel.find({raiserId:studentId}).lean<IQuery[]>();
        res.status(200).json({message :"Queries Found" , data:queries})  
    } catch (error : any) {
        res.status(500).json({message : "Error Occured" , error : error.message})
    }
}