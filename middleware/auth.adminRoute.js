import {user} from "../models/user.model.js";
export const adminRoute = async(req,res,next)=>{
    try{
if(req.user?.role !=="admin"){
    return res.status(403).json({success:false,message:"Access Denied,Admin only"});
}
next(); //next() control transfer function
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Something went Wrong :",
            error:error.message

     });
    } 
};