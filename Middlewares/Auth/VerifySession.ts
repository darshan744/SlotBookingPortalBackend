import { NextFunction, Request, Response } from "express"


export function authorize(role:string) {
  return async (req : Request , res : Response , next : NextFunction)=>{
    const session = req.session.user;
    if(!session){
      res.status(401).json({message:"Please Login Again" , success:false});
    } 
    else if(session && session.role === role) {
      next();
      return 
    }
    else {
      res.status(401).json({message:"Forbidden" , success:false});
    }
  }
}
