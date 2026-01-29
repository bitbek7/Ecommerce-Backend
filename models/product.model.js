import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
        unique:true,
        minlength:2,
        maxlength:100,//immutable:true :once set,can't be changed, default:"bibek" :Auto vlaue
    },
    description:{
        type: String,
        required:true,
    },
    price:{
        type: Number,
        min:0,
        required:true,  
    },
    discountPercentage:{
        type:Number,
    },  
    image:{
        type: String,
        required:[true,"Image is required:"],//custom error message if someone forgets to add image then this message will be shown

    },
    category:{
        type:String,
        required:true,
    },
    brand:{
        type: String,
        required: true,
    
    },
    stock:{
        type:Number,
        required:true,
        min:0
    },
    ratings:{
        type:Number,
        default:0,   //default rating is 0 means no ratings yet but as users start rating the product this value will change
    },
    numReviews:{
        type:Number,
        default:0
    },
    isFeatured:{  //to show some product on homepage (Basically  it is used for highlighting some products on homepage)
        type:Boolean, //{name: Red-Tshirt, price:399, isFeatured:true}  this product eill be shown on homepage because isFeatured is true...
        default: false
    }
    }, { timestamps: true }); //This is schema option automatically add two field createdAt :when docukment was first created, updatedAt we won't have to manually set these mongoose does it for us!

    const Product= mongoose.model("Productsplural",productSchema);
    module.exports= Product;