
import express from "express";
import { getAllProducts , getFeaturedProducts, createProduct, deleteProduct} from "../controllers/product.controller.js";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get('/',protectRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.post('/',protectRoute, adminRoute, createProduct);
router.delete('/:id',protectRoute, adminRoute, deleteProduct);

export default router;