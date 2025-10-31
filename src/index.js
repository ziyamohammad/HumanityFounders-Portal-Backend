import dotenv from "dotenv"
import { connectdb } from "./database/connectdb.js"
import { app } from "./app.js"

dotenv.config({
    path:"./env"
})

const PORT = process.env.PORT
connectdb()
.then(()=>{
    
    app.on("error",()=>{
        console.log("ERROR",error);
        throw error;
    })
    app.listen(PORT,()=>{
        console.log(`App is listening on Port ${PORT}`)
    })
}).catch((error)=>{
    console.log("Error in Connecting to Database",error.message)
})
