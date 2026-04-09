import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema= new mongoose.Schema(
    {
        userName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user",
        },
        isverified:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true},
);
authSchema.pre("save",async function (next) {
    try{
        const salt=await bcrypt.genSalt(10);
        const hashePassword =await bcrypt.hash(this.password,salt);
        this.password= hashePassword;
        next()

    }catch(err){
        console.log(err)
    }
    
})
authSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


export const Auth = mongoose.model("Auth",authSchema); 