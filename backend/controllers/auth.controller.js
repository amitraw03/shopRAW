import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";  // to create tokens for authentication
import { redis } from "../lib/redis.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" });
    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days
}
// functn to make a cookie for the user after signup/registration
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken' , accessToken, {
        httpOnly: true,   // prevent from XSS attacks , cross-site scripting attacks
        secure: process.env.NODE_ENV === 'production',  
        sameSite: 'strict',  // prevents CSRF attacks, cross site request forgery attack
        maxAge: 15 * 60 * 1000,  // 15 MINUTES
    });
    res.cookie('refreshToken' , refreshToken, {
        httpOnly: true,   // prevent from XSS attacks , cross-site scripting attacks
        secure: process.env.NODE_ENV === 'production',  
        sameSite: 'strict',  // prevents CSRF attacks, cross site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 DAYS
    });
};

export const signup = async (req, res) => {   // endpoint for signup
    const { email, password, name } = req.body;  // collect details from frontend

    try {
        const userExits = await User.findOne({ email });
        if (userExits) {
            return res.status(401).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password });

        //LETS authenticate by creation of tokens for created USer{ in Cookie format}  and store in redis  
        const { accessToken, refreshToken } = generateTokens(user._id);
        //we need to save refresh Token in D.B {in REDIS for faster access} to prevent from continuous login info  demand
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);


        // remove password & refresh token field while sending response
        const createdUser = await User.findById(user._id).select(
            "-password -cartItems"
        )

        res.status(201).json({ createdUser, message: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {   // endpoint for Login
    res.send('LogIn route called');
}
export const logout = async (req, res) => {   // endpoint for Logout
    res.send('LogOut route called');
}