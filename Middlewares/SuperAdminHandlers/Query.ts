import {Request , Response} from 'express';

import { queryModel } from '../../Models/Query.model';
import { IQuery } from '../../Models/interfaces';

export const getQueries = async(req : Request , res:Response)=>{
    try {
        const queries = await queryModel.find({}).lean<IQuery>();
        res.status(200).json({message :"Queries Found" , data:queries})  
    } catch (error : any) {
        res.status(500).json({message : "Error Occured" , error : error.message})
    }
}

export const postRemarksToQuery = async(req : Request , res:Response)=>{
    const {remarks , queryId , status} = req.body;
    try {
        const query = await queryModel.findOne({ queryId });
        if(!query) {
            res.status(404).json({message:"No such query found"});
            return;
        }
        query.remarks = remarks;
        query.status = status;
        await query.save();
        res.status(200).json({message : "Remarks Added"})
    }
    catch(e:any) {
        res.status(500).json({message : "Server Error" , error : e.message});
    }
}
