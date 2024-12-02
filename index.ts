import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { DatabaseConnection } from "./DatabaseConnection";
import cors from "cors";
import { router as AdminRoutes } from "./Routes/Admin.routes";
import { router as superAdminRoutes } from "./Routes/SuperAdmin.routes";
import { router as StudentRoutes } from "./Routes/Student.routes";
import session from "express-session";
import MongoStore from 'connect-mongo'
import { eventModel } from "./Models/Event.model";
import { googleLogin } from "./Middlewares/SignIn/GoogleSignin";
import { authenticate } from "./Middlewares/SignIn/CredSignIn";
import { StaffModel } from "./Models/Staff.model";
import { StudentModel } from "./Models/Student.model";
import { IStaff, IStudent } from "./Models/interfaces";
import { UserModel } from "./Models/User.model";

const app: Express = express();
dotenv.config({ path: "Config/.env" });
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true,// Allow all origins (you can restrict this in production)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: [
    "Cross-Origin-Opener-Policy",
    "Cross-Origin-Embedder-Policy",
    "Set-Cookie",
  ],
})
);

const storeSession = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  collectionName: "sessions",
  ttl: 60 * 60,
})

app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  store: storeSession,
  cookie: { secure: false, maxAge: 60000 * 60 * 60, httpOnly: true, }
}));

declare module "express-session" {
  interface Session {
    user: {
      objectId: string,
      id: String,
      name: String,
      role : string,
    }
  }
}
DatabaseConnection();
app.use(express.json());
app.post("/api/v1/google/login", googleLogin);
app.post("/api/v1/login", authenticate);
app.post("/api/v1/logout", (req, res) => {
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
});

app.use("/api/v1/SuperAdmin", superAdminRoutes);
app.use("/api/v1/Admin", AdminRoutes);
app.use("/api/v1/Students", StudentRoutes);
app.get("/api/v1/verify" ,  (req , res ) => {
  if(req.session.user) {
    res.json({role : req.session.user.role})
  }
  else {
    res.json({ role : "none"})
  }
})

app.get('/api/v1/events' ,Events);

async function Events (req : Request, res : Response) {
   try {
    const events =  await eventModel.find({},{Name:1 , _id:0});
    console.log(events);
    if(events) {
      res.json({ message : 'Successfull' ,data:events})
    }
    else {
      res.json({message:"No events FOund"})
    }
   }
   catch(e) {
    res.json({Message: " Error Occured"})
   }
  }

app.listen(process.env.PORT, () => {
  console.log(`Server Listening in http://localhost:${process.env.PORT}`);
});

const migrateData = async () => {
   let staffs : any= await StaffModel.find({} , {staffId : 1 , email:1 , _id:1});
  //  staffs = staffs.map((e : IStaff)=>({...e , password:"070402004"}));
  //  console.log(a);
  let students = await StudentModel.find({} , {studentId : 1 ,_id : 1 , email : 1, password : 1})
  let a = staffs.map((e : IStaff)=>({id : e.staffId , email : e.email, password:"07042004" , 
    objectId:e._id ,role:"staffs" }))
  let b  = students.map((e:IStudent) => ({id : e.studentId , email : e.email ,
     password : e.password , objectId:e._id ,role:"student"  }));
  //  console.log(students)
  const users = [...a , ...b]
  try {
    await UserModel.insertMany(users);
  } catch (error:any) {
    console.warn(error.message);
  }  
}
migrateData();