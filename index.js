const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'Config/.env'});

app.listen(process.env.PORT,()=>{
    console.log(`Server Listening ${process.env.PORT}`);
});
