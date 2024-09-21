
import express from "express";
import {
    getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts,
    getProductsByCategory,
    toggleFeaturedProducts
} from "../controllers/product.controller.js";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//--> /api/products configurations
router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommendations', getRecommendedProducts);
router.get('/category/:category', getProductsByCategory);
router.post('/', protectRoute, adminRoute, createProduct);
router.put('/:id', protectRoute, adminRoute, toggleFeaturedProducts);
router.delete('/:id', protectRoute, adminRoute, deleteProduct);

export default router;