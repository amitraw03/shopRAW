import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        //checking user is active or not so ny checking its accessToken
        const accessToken = req.cookies?.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized no-access-token provided" });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password"); //so that active user not contain password becoz no work
            if (!user) {
                return res.status(401).json({ message: "Unauthorized user not found" });
            }

            req.user = user;
            next();

        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized token expired" });
            }
            throw error;
        }

    }
    catch (error) {
        console.log('Error in protectRoute middleware', error.message);
        res.status(500).json({ message: 'Unauthorized Invalid Access Token' });

    }
};


export const adminRoute = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next();
    }
    else{
        res.status(403).json({ message: "Access Denied- Admin Only" });
    }
};