import{express}from "express";
import {register,login,logout} from "../controllers/";
import{protectRoute}from "../middleware/auth.";