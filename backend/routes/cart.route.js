import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addToCart, getCartProducts, removeAllFromCart, updateCartProductQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

//--> /api/cart configurations
router.get('/', protectRoute, getCartProducts );
router.post('/', protectRoute, addToCart );
router.delete('/',protectRoute, removeAllFromCart);
router.put('/:id', protectRoute, updateCartProductQuantity);  // to update quantity by '+' or '-'


export default router;