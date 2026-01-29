import express from "express";
import {protectRoute} from "../middleware/auth.protectRoute";
import { getAllProducts,addTocCart,removeAllFromCart,updateQuantity } from "../controllers/cart.controller.js";
const router= express.Router();

router.get("/",protectRoute,getCartProducts);
router.post("/",protectRoute,addTocCart);
router.delete("/",protectRoute,removeAllFromCart);
router.delete("/:id",protectRoute,updateQuantity);

export default router;