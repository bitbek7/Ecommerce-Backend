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
        max:100
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
const couponModel=mongoose.model("couponModel",couponSchema);
module.exports=couponModel;