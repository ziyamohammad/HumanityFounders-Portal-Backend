import e from "express";
import { Employee } from "../models/Employer.models.js";
import { Apierror } from "../utils/Apierror.utils.js";
import { Apiresponse } from "../utils/Apiresponse.utils.js";
import { asynchandler } from "../utils/Asynchandler.utils.js";
import { uploadcloudinary } from "../utils/Cloudinary.utils.js";


const login = asynchandler(async(req,res)=>{
    const {id,password} = req.body 

    if(!id || !password){
        throw new Apierror(400,"Please enter all the fields")
    }
    
    //finding employee with this mail
    const employee = await Employee.findById(id.toString())
    if(!employee){
        throw new Apierror(404,"User not Found")
    }

    const passwordcorrect = await employee.isPasswordCorrect(password)
    if(!passwordcorrect){
        throw new Apierror(401,"Incorrect Password")
    }

    const token = await employee.generateToken()
    if(!token){
        throw new Apierror(401,"Token not generated successfully")
    }

    const options = {
       httpOnly:true,
       secure:false,
       sameSite:"lax"
    }

    res.status(200)
    .cookie("token",token,options)
    .json(new Apiresponse(201,"Employee Loginned Successfully",employee))
})

//Get all the employers details on website mounting

const getdetails = asynchandler(async(req,res)=>{
    const user = req.user
    if(!user){
        throw new Apierror(401,"Something went wrong in saving user after verification")
    }

    res.status(200)
    .json(new Apiresponse(200,"User Detauls Fetched Successfully",user))
})

//Controller for employers to add and update their personal details

const updatedetails = asynchandler(async(req,res)=>{
    const {profilepicture ,telegramid ,toptrackerid ,telegramsnap ,toptrackersnap , phonenumber} = req.body

    //getting user which we get after verifytoken
    const user = req.user
    
    // const login = await Employee.findById(user.id.toString())


    
    //if user give profilepicture then add
        const profileimagepath = req.files?.profilepicture?.[0]?.path
        if(profileimagepath){
            const image = await uploadcloudinary(profileimagepath)
            console.log(image.url)
            user.profilepicture = image.url
        }
    

    //if user give profilepicture then add
    
        const snappath = req.files?.telegramsnap?.[0]?.path
        if(snappath){
            const image = await uploadcloudinary(snappath)
            console.log(image.url)
            user.telegramsnap = image.url
        
    }

    //if user give profilepicture then add
     
        const imagepath = req.files?.toptrackersnap?.[0]?.path
        if(imagepath){
            const image = await uploadcloudinary(imagepath)
            console.log(image.url)
            user.topTrackerSnap = image.url
        
    }
    
    //telegram id added
    if(telegramid){
        user.telegramid = telegramid
    }
    
    //toptracker id added
    if(toptrackerid){
        user.topTrackerid = toptrackerid
    }
    
    //phonenumber added
    if(phonenumber){
        user.phonenumber = phonenumber
    }

    await user.save({validateBeforeSave:false})

    res.status(200)
    .json(new Apiresponse(200,"Credentials Saved Successfully",user))
})

const dailyupdates = asynchandler(async(req,res)=>{
    const {projectname,description} = req.body
    const user = req.user

    if(!projectname || !description){
        throw new Apierror(400,"Please fill all required Fields")
    }

    const employee = await Employee.findById(user.id.toString())

    if(!employee){
        throw new Apierror(404,"Employee not found")
    }

    employee.updates.push({
        projectname:projectname,
        description:description,
    })

    await employee.save({validateBeforeSave:false})

    res.status(200)
    .json(new Apiresponse(200,"Daily Updates saved Successfully",employee))


})

export {login,getdetails,updatedetails,dailyupdates}