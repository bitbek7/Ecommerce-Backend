import bycrypt from "bycrypt";
import {user} from "../models.user.model.js";
import {generateAccessToken,generateRefreshToken} from '../utils/generateTokens.js';
export  const register=async(req,res)=>{
    const {name,email,password}=req.body;
    const userExists= await user.findOne({email});
    if(userExists){
        return res.status(400).json({success:false,message:"User already exists"});
    }
    const hashedpassword= await bycrypt.hash(password,10);
    const newuser=await user.create({name,email,password:hashedpassword});
    res.status(201).json({success:true,message:"User registered successfully",});
};
export const login=async(req,res)=>{
    const{email,password}=req.body;
    const user=await user.findOne(email);
    if(!user){
        return res.status(403).json({success:false,message:"Invalid email or password"});
    }
    const ismatched=await bycrypt.compare(password,user.password);
    if(!ismatched){
        return res.status(403).json({success:false,message:"Invalid email or passwoerd"});
    }
    const accesstoken=generateAccessToken(user._id);
    const refereshtoken=generateRefreshToken(user._id);
    //stores token in cookies
    res.cookie("accessToken",accessToken,{
        httpOnly:true, //prevent XSS attacks;
        secure:true, //only send over HTTPs
        sameSite:"strict",
        maxAge:15*60*1000
    });
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        secure:true,
        sameSite:"strict"
    });
    res.json({message:"login successful"})};

    export const logout= async(req,res)=>{
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({success:true,message:"Logout successful"});
    }