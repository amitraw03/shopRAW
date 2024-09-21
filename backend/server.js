import dotenv from "dotenv";
dotenv.config();

import express from "express";
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




app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


const PORT= process.env.PORT || 7000;

//configurations--
app.use(express.json({limit :"15kb"})) //data coming in backend as json format
app.use(express.urlencoded({extended:true,limit :"15kb"}))
app.use(express.static("public"))  //by setting this config, our express assume local folders as static
app.use(cookieParser())

// all routes config
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});