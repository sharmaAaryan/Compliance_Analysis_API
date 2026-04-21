import { Product } from "../models/porduct.schema.js";
export const creatproduct =async(req,resizeBy,next)=>{
    try{
        console.log(req.body);
        console.log(req.files);
        resizeBy.status(202).json({
            message:"done"
        })

    }catch (err){
        return resizeBy.status(500).json({
            Message:err.Message,
        });
    }
};