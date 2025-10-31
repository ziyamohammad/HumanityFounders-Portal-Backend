import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const EmployeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    gender:{
        type:String,
        enum:["Male","Female"],
    },
    password:{
        type:String,
        required:true,
    },
    telegramid:{
        type:String,
        default:"",
        trim:true
    },
    profilepicture:{
        type:String,
        default:"",
    },
    telegramsnap:{
        type:String,
        default:"",
    },
    topTrackerSnap:{
        type:String,
        default:"",
    },
    phonenumber:{
        type:String,
        default:""
    },
    topTrackerid:{
        type:String,
        default:"",
        trim:true
    },
    updates:[
        {
            projectname:{
                type:String,
                default:""
            },
            description:{
                type:String,
                default:""
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    isVerified:{
        type:Boolean,
        default:false
    },
    designation:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:String,
        enum:["Active & Paid" , "Active & Unpaid" , "Inactive" , "Onboarding"],
        trim:true,
    },
    tasks:[
        {
            title:{
                type:String,
                default:"",
            },
            details:{
                type:String,
                default:"",
            },
            assigneddate:{
                type:String,
                default:"",
            },
            duration:{
                type:String,
                default:"",
            },
            linkedProject:{
                 type:String,
                 default:"",
            },
            isCompleted:{
                type:Boolean,
                default:false
            },
            setasDailyGoal:{
                type:Boolean,
                default:false
            }
        }
    ],
    projects:[
        {
            projectid:{
                type:String,
                default:""
            }
        }
    ]
},{timestamps:true})

EmployeeSchema.pre("save", async function(next){
   if(!this.isModified("password"))return next();
   this.password = await bcrypt.hash(this.password,10)
})

EmployeeSchema.methods.isPasswordCorrect = function(password){
    if(!password)return null
    return bcrypt.compare(password,this.password)
}

EmployeeSchema.methods.generateToken = function(){
  return jwt.sign({
    id:this._id,
    email:this.email,
    name:this.name
  },
    process.env.JWT_TOKEN,
   {
    expiresIn:process.env.TOKEN_EXPIRY
   }
)}

export const Employee = mongoose.model("Employee",EmployeeSchema)