const mongoose = require('mongoose');
const {AvailabilityModel} = require('./Models/Availability.model')
function DatabaseConnection() {
    mongoose.connect(process.env.DB_URL).then((con)=>{
        console.log("Database is connect in " + con.connection.host + " in port : " + con.connection.port);
    })
}

module.exports = {DatabaseConnection};