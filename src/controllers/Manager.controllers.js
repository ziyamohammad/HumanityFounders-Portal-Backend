import { Employee } from "../models/Employer.models.js";
import { Apierror } from "../utils/Apierror.utils.js";
import { Apiresponse } from "../utils/Apiresponse.utils.js";
import { asynchandler } from "../utils/Asynchandler.utils.js";
import nodemailer from "nodemailer"

//Manager adding new Employee to Database
const addemployee = asynchandler(async(req,res)=>{
    try {
        const {email,name,password,designation,status} = req.body
        
        //validating
        if(!email || !name || !password ||!designation ||!status){
            throw new Apierror(400,"Please Enter all the Requires Fields")
        }
         
        //checking if employee already exists
        const existinguser = await Employee.findOne({
            $or:[{email},{password}]
        })
    
        if(existinguser){
            throw new Apierror(409,"Employee with this crdentials already exists")
        }
        
        //Creating the employee
        const employee = await Employee.create({
          name,
          email,
          password,
          designation,
          status,
        })
        await employee.save({validateBeforeSave:false})

        const transporter = nodemailer.createTransport({
            host: "gvam1102.siteground.biz", // SMTP server from your mail panel
            port: 465, // Use 465 for secure (SSL)
            secure: true, // true for 465, false for 587
            auth: {
                user:process.env.SMTP_USER, // your full email
                pass:process.env.SMTP_PASS || "55k=2`e$1m|1", // your email password
                  },
            })

        const mailoptions = {
            to:email,
            from:process.env.SMTP_USER,
            subject:"Registration Confirmation Mail",
            text:`Your Credentials for the login to Job Portal are given below \n Id : ${employee.id} \npassword : ${password}`
         }

        await transporter.sendMail(mailoptions)
    
        res.status(200)
        .json(new Apiresponse(201,"User Created Successfully",employee))
    } catch (error) {
        console.log("Error",error.message)
    }

})

const assigntask = asynchandler(async(req,res)=>{
    const {employeeid,title,details,assigneddate,linkedproject,duration} = req.body

    if(!employeeid || !title || !details ||!assigneddate ||!linkedproject ||!duration){
        throw new Apierror(400,"Please fill all required Fields")
    }

    const employee = await Employee.findById(employeeid)

    if(!employee){
        throw new Apierror(404,"Employee not found")
    }

    employee.tasks.push({
        title:title,
        details:details,
        assigneddate:assigneddate,
        linkedProject:linkedproject,
        duration:duration
    })

    await employee.save({validateBeforeSave:false})

    res.status(200)
    .json(new Apiresponse(200,"Task assigned Successfully",employee))


})

export{addemployee,assigntask}