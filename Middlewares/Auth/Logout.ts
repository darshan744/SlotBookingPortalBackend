import { Request , Response } from "express";

export async function logout (req : Request , res : Response ) {
    console.log("Logging out");
    console.log(req.session);
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Error Logging out" });
      } else {
        res.clearCookie('session', { path: '/' });  
        console.log("Logged out");
        res.json({ message: "Logged out" });
      }
    });
  }