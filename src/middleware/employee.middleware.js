import jwt from "jsonwebtoken"
import { asynchandler } from "../utils/Asynchandler.utils.js"
import { Apierror } from "../utils/Apierror.utils.js"
import { Employee } from "../models/Employer.models.js"


const verifyjwt = asynchandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "")
    
        if(!token){
            throw new Apierror(401,"Token not Found in Headers")
        }
    
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)
    
        if(!decoded){
            throw new Apierror(401,"User Unauthorized")
        }
    
        const employee = await Employee.findById(decoded.id)
        if(!employee){
            throw new Apierror(404,"User not found in Database")
        }
    
        req.user = employee
        next()
    } catch (error) {
         console.log("Something went wrong in verifying Token",error.message)
    }

})

export {verifyjwt}