import { SuperAdminModel, UserModel } from "../Models/User.model";
import { Request , Response } from "express";
export async function insertUser(req:Request , res:Response) {
    const body = req.body;
    console.log(req.body);
    // res.json(body);
    try {
        const result = await UserModel.create(body.data);
        res.json({message:"SuccessFully inserted" , result});
    } catch (error:any) {
        res.json({e : error.message})
    }
}