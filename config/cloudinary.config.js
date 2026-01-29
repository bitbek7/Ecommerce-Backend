import {v2 as cloudinary } from "cloudinary"; //cloudiniary V2 is the stable APi version of their Node.js SDK,
                                              // providing core features like Image/video upload,URL-based transformation(e.g., resizing,cropping,effects)   
import dotenv from "dotenv";
dotenv.config(); //dotenv loads environment variables from a .env file into process.env.

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET}
)
export default cloudinary;