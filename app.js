import express from "express";
import dotenv from "dotenv";
import cookieParser from "cokkie-parser";
import connectDB from "./config/db.js";
import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import couponRoute from "./routes/coupon.route.js";
import paymentRoute from "./routes/payment.route.js";
import authRoute from "./routes/auth.route.js";
import orderRoute from "./routes/order.route.js";

import path from "path";

dotenv.config();
const app=express();
connectDB();
app.use(express.json());
app.use(cookieParser());
//Routes Middleware...
app.use("/api/products",productRoute);
app.use("/api/cart",cartRoute);
app.use("/api/coupons",couponRoute);
app.use("/api/payments",paymentRoute);
app.use("/api/auth",authRoute);
app.use("/api/orders",orderRoute);  
app.use("/api/v1/analytics",analyticsRoute);// i hvae to implement

export default app;