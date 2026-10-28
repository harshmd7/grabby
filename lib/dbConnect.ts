
import mongoose from "mongoose";

type connectionObj= {
    isConnected?:number
}
const connection:connectionObj = {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("database is alredy connected");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI||'')
        connection.isConnected = db.connections[0].readyState
        console.log("db is connected");
        
        
    } catch (error) {
        console.log('error while connecting to db, ',error);
         process.exit(1)
        
    }
    
}
export default dbConnect