import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true,match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please enter the valid email address"]},
    password:{type:String,required:true,minlength:[8,"Password must be at least 8 characters long"],match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must contain at least one uppercase, lowercase, number ,and special character"]},
    cartItems:[{quantity:{type:Number,default:1},product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"}}],
    role:{type:String,required:true,enum:{values:['user','admin'],message:"Role must be either user or admin"},default:"user"},
},{timestamps:true}); 
 const user=mongoose.model("user",userSchema);
 modules.export=user;