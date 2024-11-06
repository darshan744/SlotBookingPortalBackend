import express , { Request , Response} from "express";
import dotenv from 'dotenv'
import {DatabaseConnection} from './DatabaseConnection'
import cors from 'cors';
import { router as Adminroutes} from "./Routes/Admin.routes";
import { router as superAdminRoutes } from "./Routes/SuperAdmin.routes";
import { auth } from "./Middlewares/auth";
const app = express();

dotenv.config({path : 'Config/.env'});
DatabaseConnection();

app.post('/api/v1/login',auth)
app.use(cors());
app.use(express.json())
app.use('/api/v1/SuperAdmin',superAdminRoutes);
app.use('/api/v1/Admin',Adminroutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server Listenting in http:localhost:${process.env.PORT}`)
})


