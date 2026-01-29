import jwt from "jsonwebtoken";
import {user} from "../models/user.model.js";
import { router } from "../routes/product.route.js";
import { adminRoute } from "./auth.adminRoute.js";
export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.accessToken;
        if(!token){
            return res.status(401).json({
                message:"Unauthorized access",
                success:false
            });
        }
        const decode=jwt.verify(
            token,process.env.AACESS_TOKEN_SECRET
        );
        const user= await user.findById(decode.userId).select("-password"); //select tells mongoDB which fields should be included or excluded in the result
if(!user){
    return res.status(401).json({
        success:false,
        message:"User not authorized"
    });
}
req.user=user;
next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Invalid or expired access token"+error.message
        })
    }
};router.get("/", protectRoute, adminRoute, getAllProducts);

