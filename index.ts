import express, { Express } from "express";
import dotenv from "dotenv";
import { DatabaseConnection } from "./DatabaseConnection";
import cors from "cors";
import { router as AdminRoutes } from "./Routes/Admin.routes";
import { router as superAdminRoutes } from "./Routes/SuperAdmin.routes";
import { router as StudentRoutes } from "./Routes/Student.routes";
import { authenticate, googleLogin } from "./Middlewares/auth";
import session from "express-session";
import MongoStore from 'connect-mongo'

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
  cookie: { secure: false, maxAge: 60000 * 60, httpOnly: true, }
}));

declare module "express-session" {
  interface Session {
    user: {
      objectId: string,
      id: String,
      name: String,
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

app.listen(process.env.PORT, () => {
  console.log(`Server Listening in http://localhost:${process.env.PORT}`);
});
