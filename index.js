const express = require('express');
const app = express();
const dotenv = require('dotenv');
const Database = require('./DatabaseConnection');
const superAdminRoutes = require('./Routes/SuperAdmin.routes')
const AdminRoutes = require('./Routes/Admin.routes');
const cors = require('cors');
const {auth} = require('./Middlewares/Authenticate.middleware')

dotenv.config({path:'Config/.env'});

Database.DatabaseConnection();
app.use(express.json());
app.use(cors());

app.post('/api/v1/login',auth)
app.use('/api/v1/SuperAdmin',superAdminRoutes);
app.use('/api/v1/Admin',AdminRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server Listening ${process.env.PORT}`);
});


