import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
         type:String,
        required:true,
        unique:true,
    },
    startDate:{
         type:String,
        required:true,
        unique:true,
    },
    endDate:{
        type:String,
        required:true,
        unique:true,
    },
    employeeAlloted:[
        {
       type:mongoose.Schema.Types.ObjectId,
       ref:"Employee"
        }
    ]
},{timestamps:true})

export const Project = mongoose.model("Project",ProjectSchema)