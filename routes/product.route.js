import {protectRoute} from "../middleware/auth.protectRoute.js";//relative path for protectRoute like a middleware function that is used to protect certain routes so that only the authenticated users can access the route.
import {adminRoute}from "../middleware/auth.adminRoute.js";
import express from "express";
import {getFeaturedProducts,getProductsByCategory,getRecommandProducts,createProduct,toggleFeaturedProduct,deleteProduct} from "../controllers/productcontroller.js";
export const router=express.Router();

router.get("/featured",getFeaturedProducts);
router.get("/category/:category",getProductsByCategory);
router.get("/recommendation", getRecommandProducts);

router.post("/",protectRoute,adminRoute,createProduct);
router.patch("/:id",protectRoute,adminRoute,toggleFeaturedProduct);

router.delete("/:id",protectRoute,adminRoute,deleteProduct);

export default router;