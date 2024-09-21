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