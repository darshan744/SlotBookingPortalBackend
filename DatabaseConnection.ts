import mongoose from "mongoose";

export function DatabaseConnection() {
    mongoose.connect(process.env.DB_URL!).then((e)=> {
        console.log(`Database Connected in  ${e.connection.host}:${e.connection.port}`);
    })
}
