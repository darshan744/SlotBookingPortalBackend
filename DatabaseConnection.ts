import mongoose from "mongoose";

export function DatabaseConnection() {
    if(!process.env.DB_URL) {
        console.log("MongoDB connection required");
        process.exit(1);
    }
    mongoose.connect(process.env.DB_URL!)
        .then((e)=> {
            console.log(`Database Connected in  ${e.connection.host}:${e.connection.port}`);
        })
        .catch((err:any)=>{
            console.log('Database Connection Error:', err.message);
        })
}
