import Product from "../models/product.model.js";
import { redis } from "../config/redis.config.js";
import { cloudinary } from "../config/cloudinary.config.js";
export const getAllProducts = async (req, res) => {
    try {
        const product = await Product.find({});
        res.status(200).json({ product });
    }
    catch (error) {
        console.log("Error on getting all the product", error.message);
        res.status(500).json({ message: error.message });
    }
};
export const getFeaturedProducts = async (req, res) => {
    try {   //first we will check the product exist in reddis or not 
        let featuredProducts = await redis.get("featured_product");//get featured product from redis
        if (featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts))
        }
        //if not in reddis , fetch from mongoDB
        //.lean() this methods is goona return a plain js obj instead of mongodb document
        featuredProducts = await Product.find({ isFeatured: true }).lean(); //redis only store strings not the raw JS objects
        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured proucts" });
        }
        //store in reddis for future quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts))
        res.status(200).json({ featuredProducts });
    } catch (error) {
        console.log("Error in getting featured product", error.message);
        res.status(500).json({ message: error.message });
    }
};
export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $sample: { size: 6 } },//$sample means pick random documents from the collection size:6 means this would return 6 random products
            {
                $project: {  //$project control which field to include or exclude
                    _id: 1,  //1 means include this field 
                    name: 1,
                    image: 1,
                    price: 1,
                    category: 1,
                    description: 1
                }
            }
        ]);
        res.status(200).json({ products });
    } catch (error) {
        console.log("Error in get recommend products controller", error.message);
        res.status(500).json({ message: error.message });
    }
};
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        console.log("Error in get prodects by category controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, discountPercentage, image, category, brand, stock } = req.body;
        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }
        const product = await Product.create({ name, description, price, image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "", category })
        res.status(201).json({ product });
    }
    catch (error) {
        console.log("Error in create product controller", error.message);
        res.status(500).json({ message: error.message });

    }
};
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isfeatured;
            const updateProduct = await product.save();
            await updatedfeaturedProductsCache();
            res.json(updateProduct);

        }
    }
    catch (error) {

    }
};
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product npt found" });

        }
        if (product.image) {
            const publicId = product.image.split("/").pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`/products/${publicId}`);
                console.log("Image deleted from cloudinary");
            } catch (error) {
                console.log("Error in deleting image from cloudinary", error.message);
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted succesfully" });

    } catch (error) {
        console.log("Error in deleting product controller", error.message);
        res.status(500).json({ message: error.message });
    }
};



const updatedfeaturedProductsCache = async () => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    }
    catch (error) {
        console.log("Error in update featured products cache", error.message);
    }
}