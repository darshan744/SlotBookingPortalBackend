const express = require('express');
const app = express();
const dotenv = require('dotenv');
const Database = require('./Config/DatabaseConnection');
dotenv.config({path:'Config/.env'});

app.listen(process.env.PORT,()=>{
    console.log(`Server Listening ${process.env.PORT}`);
});
Database();
