import { Request , Response } from "express";

export async function logout (req : Request , res : Response ) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Error Logging out" });
      } else {
        res.clearCookie('session', { path: '/' });  
        res.json({ message: "Logged out" });
      }
    });
  }