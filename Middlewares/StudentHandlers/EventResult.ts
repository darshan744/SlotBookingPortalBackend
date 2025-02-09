import {Request  , Response } from 'express';
import { StudentModel } from '../../Models/Student.model';

export const getEventResult = async (req : Request , res : Response) : Promise<void> => {
    let studentId = req.params.id;
    try{
      const studentEventResult = await StudentModel.findOne({id : studentId},{EventHistory:1 , _id:0});
      res.json({success : true , data : studentEventResult});
    }
    catch(e) {
      res.json({success : false , message : "Cannot Retrieve Event Result"});
    }
  }