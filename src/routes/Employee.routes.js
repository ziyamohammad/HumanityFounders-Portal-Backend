import {Router} from "express"
import { dailyupdates, getdetails, login, updatedetails } from "../controllers/employee.controllers.js"
import { verifyjwt } from "../middleware/employee.middleware.js"
import { upload } from "../middleware/multer.middlewares.js"

const employerrouter = Router()

employerrouter.route("/login").post(login)
employerrouter.route("/getdetails").get(verifyjwt,getdetails)
employerrouter.route("/updatedetails").put(upload.fields([
    {
        name:"profilepicture",
        maxCount:1
    },
    {
        name:"telegramsnap",
        maxCount:1
    },
    {
        name:"toptrackersnap",
        maxCount:1
    }
]),verifyjwt,updatedetails)
employerrouter.route("/dailyupdates").post(verifyjwt,dailyupdates)

export {employerrouter}