import express from "express"
import cors from "cors"
import CookieParser from "cookie-parser"

const app = express()

app.use(cors({
   origin:"*",
   credentials:true
}))

//general settings
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(CookieParser())

//routes
import { managerrouter } from "./routes/Manager.routes.js"
import { employerrouter } from "./routes/Employee.routes.js"

app.use("/api/v1/manager",managerrouter)
app.use("/api/v1/employee",employerrouter)

export {app}