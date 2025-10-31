import mongoose from "mongoose"

const ManagerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }

    
},{timestamps:true})

ManagerSchema.pre("save", async function(next){
   if(!this.isModified("password"))return next();
   this.password = await bcrypt.hash(this.password,10)
})

ManagerSchema.methods.isPasswordCorrect = function(password){
    if(!password)return null
    return bcrypt.compare(password,this.password)
}

ManagerSchema.methods.generateToken = () =>{
  return jwt.sign({
    id:this.id,
    email:this.email,
    name:this.name
  },
    process.env.JWT_TOKEN_MANAGER,
   {
    expiresIn:process.env.TOKEN_EXPIRY_MANAGER
   }
)}

export const Manager = mongoose.model("Manager",ManagerSchema)