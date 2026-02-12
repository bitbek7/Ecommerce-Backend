import express from "express";
import {protectRoute } from "../middleware/auth.protectRoute.js";
import {getMyOrder,createOrder} from "../controller/order.controller.js";

const router= express.Router();

router.get("/my-orders",protectRoute,getMyOrder);
router.post("/",protectRoute,createOrder);
export default router;