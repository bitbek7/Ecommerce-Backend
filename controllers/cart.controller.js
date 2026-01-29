import Prducts from "../model/product.model.js";
export const getCartProducts=async (req,res)=>{
    try {
        const products=await Product.find({})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
};
export const addTocCart=async (req,res)=>{};
export const removeAllFromCart=async(req,res)=>{};
export const updateQuantity=async(req,res)=>{};
