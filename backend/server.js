import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app =express();

app.use('/api/auth',authRoutes) 

const PORT= process.env.PORT || 7000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});