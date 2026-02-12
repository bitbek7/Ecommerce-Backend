import mongoose from mongoose;
const couponSchema=new mongoose.schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    discountPercentage:{
        type:Number,
        required:true,
        min:0,
        max:85
    },
    expirationDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true
    }
},{timestamps:true});
const Coupon=mongoose.model("couponModel",couponSchema);
module.exports=Coupon;