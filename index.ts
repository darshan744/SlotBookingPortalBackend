import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from 'connect-mongo'
import { DatabaseConnection } from "./DatabaseConnection";
import { router as AdminRoutes } from "./Routes/Admin.routes";
import { router as superAdminRoutes } from "./Routes/SuperAdmin.routes";
import { router as StudentRoutes } from "./Routes/Student.routes";
import { googleLogin } from "./Middlewares/Auth/GoogleSignin";
import { authenticate } from "./Middlewares/Auth/CredSignIn";
import { logout } from "./Middlewares/Auth/Logout";
import { Events } from "./Middlewares/SuperAdminHandlers/Events";
import { authorize } from "./Middlewares/Auth/VerifySession";
import { insertUser } from "./Middlewares/insertUser";

const app: Express = express();
dotenv.config({ path: "Config/.env" });

//addding user type for session interface
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
/** ---------OPTIONS------- */
//cors options
const corsOption = {
  origin: ["http://localhost:4200"],
  credentials: true, // Allow all origins (you can restrict this in production)
};
//mongoStoreOptions
const mongoStoreOptions = {
  mongoUrl: process.env.DB_URL,
  collectionName: "sessions",
  ttl: 60 * 60,
}
//creating mongo store for session storage;
const mongoStoreSessionOptions = MongoStore.create(mongoStoreOptions)
//session options
const sessionOptions = {
  name: 'session',
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  store: mongoStoreSessionOptions,
  cookie: { secure: false, maxAge: 60000 * 60 * 60 * 60, httpOnly: true, }
}


//allows other routes for communication
app.use(cors(corsOption));
//using session storage option
app.use(session(sessionOptions));
//parses the body to json object
app.use(express.json());
//DB connection
DatabaseConnection();

//log the route and method
app.use((req , res , next)=>{ 
  console.log(`Request for ${req.path} with method : ${req.method}`);
  next();
})
//for displaying resume
app.use(express.static('./public'))

//GOOGLE LOGIN
app.post("/api/v1/google/login", googleLogin);
//Id password login
app.post("/api/v1/login", authenticate);
//logout deletes the session
app.post("/api/v1/logout", logout);
//insert mock user
app.post('/api/v1/insert' , insertUser);

//SUPERADMIN ROUTES
app.use("/api/v1/SuperAdmin",authorize('SuperAdmin'), superAdminRoutes);
//ADMIN ROUTES
app.use("/api/v1/Admin",authorize('Staff'), AdminRoutes);
//STUDENT ROUTES
app.use("/api/v1/Students",authorize('Student'), StudentRoutes);
//EVENTS GLOBAL BCOZ IT IS USED BY ALL
app.get('/api/v1/events' ,Events);
//LISTENIN
app.listen(process.env.PORT, () => {
  console.log(`Server Listening in http://localhost:${process.env.PORT}`);
});

