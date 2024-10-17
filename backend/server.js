import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";

const app =express();


// Immediately invoke connectDB
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

//importing routes
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";


app.use(cors({
    origin:'http://localhost:5173' || process.env.CORS_ORIGIN,
    credentials:true
}))


const PORT= process.env.PORT || 7000;

const __dirname = path.resolve();

//configurations--
app.use(express.json({limit :"15mb"})) //data coming in backend as json format
app.use(express.urlencoded({extended:true,limit :"15kb"}))
app.use(express.static("public"))  //by setting this config, our express assume local folders as static
app.use(cookieParser())

// all routes config
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/coupons',couponRoutes);
app.use('/api/payments',paymentRoutes);
app.use('/api/analytics',analyticsRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});