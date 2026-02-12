import express from "express";
import Coupon from "../models/coupon.model.js";

export const getCoupon= async(req,res)=>{
try{
const coupon=await Coupon.findOne({userId:req.user._id,isActive:true});
res.status(200).json(coupon || null);
}
catch(error){
console.error(`Error in getCoupon ${error.message}`);
return res.status(500).json({message:"Internal Server Down"});
};
}

export const validateCoupon =async(req,res)=>{
try {
    const coupon_code=req.body;
    const coupon=await Coupon.findOne({code:code,userId:req.user_id,isActive:true});
    if(!coupon){
        return res.status(404).json({message:"Invalid or expired coupon"});
    }
    if(coupon.expirationDate<new Date()){
        coupon.isActive=false;
        await coupon.save();
        return res.status(400).json({message:"Coupon has exired"});
    }
    res.status(200).json({
        message:"Coupon is valid",
        code:coupon.code,
        discountPercentage:coupon.discountPercentage
    })
} catch (error) {
    console.log(`Error in validate:${error.message}`);
    res.status(500).json({message:"Server error during validation"});
}
};