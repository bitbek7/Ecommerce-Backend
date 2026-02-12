import Order from "../models/order.model.js";
export const createOrder=async (req,res)=>{
    try{
        const{orderItems,shippingAdress, paymentMethod, itemsPrice,totalPrice }=req.body;
        const order=await Order.create({
            orderItems,shippingAdress,paymentMethod,itemsPrice,totalPrice,user:req.user._id });
     res.status(201).json({success:true,order});
    }
    catch(error){
        console.log(`Order Creation Error:${error.message}`);
    res.status(500).json({sucess:false,message:"Server Error during the order creation "});
 }
}
export const getMyOrder=async(req,res)=>{
    try {
        const orders=await Order.find({
            user:req.user._id
        }).populate("orderItems.product","name price image");
        if(!Order || Order.length===0){
            return res.status(404).json({message:"No orders found for this user"})
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error(`Fetch Orders Error:${error.message}`);
        res.status(500).json({message:"Error on getting my orders"});
    }
}