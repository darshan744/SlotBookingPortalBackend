import express, { Express } from "express";
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
//cors options
const corsOption = {
  origin: "http://localhost:4200",
  credentials: true,// Allow all origins (you can restrict this in production)
  methods: ["GET", "POST" , "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: [
    "Cross-Origin-Opener-Policy",
    "Cross-Origin-Embedder-Policy",
    "Set-Cookie",
  ],
}
//mongoStoreOptions
const mongoStoreOptions = {
  mongoUrl: process.env.DB_URL,
  collectionName: "sessions",
  ttl: 60 * 60,
}

const mongoStoreSessionOptions = MongoStore.create(mongoStoreOptions)
const sessionOptions = {
  name: 'session',
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  store: mongoStoreSessionOptions,
  cookie: { secure: false, maxAge: 60000 * 60 * 60 * 60, httpOnly: true, }
}
DatabaseConnection();


//options
app.use(session(sessionOptions));
app.use(cors(corsOption));
app.use(express.json());

//log the route and method
app.use((req , res , next)=>{ 
  console.log(`Request for ${req.path} with method : ${req.method}`);
  next();
})

app.use(express.static('./public'))

//authentications
app.post("/api/v1/google/login", googleLogin);
app.post("/api/v1/login", authenticate);
app.post("/api/v1/logout", logout);
app.post('/api/v1/insert' , insertUser);
//routes
app.use("/api/v1/SuperAdmin",authorize('SuperAdmin'), superAdminRoutes);
app.use("/api/v1/Admin",authorize('Staff'), AdminRoutes);
app.use("/api/v1/Students",authorize('Student'), StudentRoutes);

app.get('/api/v1/events' ,Events);


app.listen(process.env.PORT, () => {
  console.log(`Server Listening in http://localhost:${process.env.PORT}`);
});