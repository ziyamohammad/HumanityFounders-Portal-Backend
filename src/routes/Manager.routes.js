import {Router} from "express"
import { addemployee, assigntask } from "../controllers/Manager.controllers.js"

const managerrouter = Router()

managerrouter.route("/addemployee").post(addemployee)
managerrouter.route("/assigntask").post(assigntask)


export {managerrouter}