import express, {Express} from "express";
import dotenv from 'dotenv'
import { DatabaseConnection } from './DatabaseConnection'
import cors from 'cors';
import { router as AdminRoutes } from "./Routes/Admin.routes";
import { router as superAdminRoutes } from "./Routes/SuperAdmin.routes";
import { router as StudentRoutes } from './Routes/Student.routes'
import { auth } from "./Middlewares/auth";
const app :Express = express();


dotenv.config({ path: 'Config/.env' });
DatabaseConnection();

app.use(cors());
app.use(express.json())
app.post('/api/v1/login', auth)
app.use('/api/v1/SuperAdmin', superAdminRoutes);
app.use('/api/v1/Admin', AdminRoutes);
app.use('/api/v1/Students', StudentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server Listening in http://localhost:${process.env.PORT}`)
})


