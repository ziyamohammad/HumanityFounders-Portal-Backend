import mongoose from "mongoose"

const connectdb = async()=>{
   try {
     const connectioninstance = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
     console.log(`Mongodb Connected \n DB Host = ${connectioninstance.connection.host}`)
   } catch (error) {
     console.log("Erron in Connection",error.message)
   }
}

export {connectdb}