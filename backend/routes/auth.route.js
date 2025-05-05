import express from "express";
import { login, logout, refreshAccessToken, signup , getProfile} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router=express.Router();

//--> /api/auth configurations
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protectRoute, logout);

router.post('/refresh-token', refreshAccessToken);

router.get('/profile', protectRoute, getProfile);

export default router;