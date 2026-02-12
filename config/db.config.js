import mongoose from "mongoose";
export const connectDb=async ()=>{
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
} catch (error) {
    console.error("Error on connecting to database",error.message);
    process.exit(1);
}
};