import { json } from "express";
import { Auth } from "../models/auth.schema.js";

export const signup =async(req,res,next)=>{
   try{
    const{userName,email,password,role}=req.body;
    if(!userName ||!password||!email){
        return res.status(400).json({
            message:"All fields are required",
        });
    }
    const isuserExist=await Auth.findOne({email: email});
    if(isuserExist){
        return res.status(400).json({
          message:"email is already exist",  
        });
    }
    const user = await Auth.create({
        email,
        userName,
        password,
        role,
    });
    return res.status(201).json({
        message:"Registered Successfully",
        data: user._id,
    });
   } catch(err){
    return res.status(500).json({
        message:err.message,
    });
   }
}
export const signin =async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"All files are required",
            })
        }
        const isEmailExist = await Auth.findOne({email:email})
        if(!isEmailExist){
            return res.status(400).json({
                message:"emil not found"
            })
        }
        const isMatch = await user.comarePassword(password);
        if(!isMatch){
            return res.status(400).json({
                message:"Password is incorrect",
            })
        }
        return res.status(200).json({
            message:"Signin succesfull",
            data:user._id,
        })
        
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }}
