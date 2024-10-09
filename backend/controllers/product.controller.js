import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import { Product } from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // findALL products in product model
        res.status(200).json(products);
    }
    catch (error) {
        console.log('Error in getAllProducts controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_Products");
        if (featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts));
        }
        // if not present in redis, fetch from mongodb 
        // .lean function gonna return a plain javascript object instead of mongodb document
        // which is good for performance

        featuredProducts = await Product.find({ isFeatured: true }).lean();
        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        // store in redis for future quick access
        await redis.set("featured_Products", JSON.stringify(featuredProducts));
        res.status(200).json(featuredProducts);

    }
    catch (error) {
        console.log('Error in getFeaturedProducts controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryReponse = null;
        if (image) {
            cloudinaryReponse = await cloudinary.uploader.upload(image, { folders: "products" });
        }
        //after getting data from frontend, store it in mongodb
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryReponse?.secure_url ? cloudinaryReponse.secure_url : null,
            category
        });
        res.status(201).json(product);

    }
    catch (error) {
        console.log('Error in createProduct controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });

    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        //lets first delete image from cloudinary
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; // this will get the image id
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("image deleted from cloudinary");
            } catch (error) {
                console.log("Error in deleting image from cloudinary", error.message);
            }
        }
        // lets delete rest data from D.B
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.log('Error in deleteProduct controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });

    }
};

// nEED to use mongodb aggregation pipelines
export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])
        res.status(200).json(products);
    }
    catch (error) {
        console.log('Error in getRecommendedProducts controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// getting particular category Products
export const getProductsByCategory = async (req, res) => {
    const {category} = req.params;
   try {
    const products = await Product.find({category:category});
    res.status(200).json({products});  // i am sending as object to frontend
    
   } catch (error) {
    console.log('Error in getProductsByCategory controller', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
   }
};


export const toggleFeaturedProducts = async (req, res) => {
     try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductCache();  // in the redis
            res.status(200).json(updatedProduct);
        }else{
            res.status(404).json({message:"Product not found"});
        }
        
     } catch (error) {
        console.log('Error in toggleFeaturedProducts controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
     }
};

// update featured products in redis
async function updateFeaturedProductCache(){
    try {
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_Products", JSON.stringify(featuredProducts)); // set updated featured_products in redis
    } catch (error) {
        console.log("Error in update Cache function", error.message);
    }
};
    