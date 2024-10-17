import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon , generateCoupon} from "../controllers/coupon.controller.js";

const router = express.Router();

//--> /api/coupons configurations
router.get('/', protectRoute , getCoupon );
router.post('/validate', protectRoute , validateCoupon );
router.post("/generate", protectRoute , generateCoupon);


export default router;