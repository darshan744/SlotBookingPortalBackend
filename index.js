const express = require('express');
const app = express();
const dotenv = require('dotenv');
const Database = require('./Config/DatabaseConnection');
const superAdminRoutes = require('./Routes/SuperAdmin')
dotenv.config({path:'Config/.env'});

app.use(express.json());
app.get('/api/v1/login/',(req,res)=>{
    console.log(req.body);
    res.redirect('http://localhost:4200/user/dashboard')
})

app.use('/api/v1/SuperAdmin',superAdminRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`Server Listening ${process.env.PORT}`);
});


