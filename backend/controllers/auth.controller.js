import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";  // to create tokens for authentication
import { redis } from "../lib/redis.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" });
    return { accessToken, refreshToken };
}
// functn to store refresh token in redis database
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days
}
// functn to make a cookie for the user after signup/registration
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,   // prevent from XSS attacks , cross-site scripting attacks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',  // prevents CSRF attacks, cross site request forgery attack
        maxAge: 15 * 60 * 1000,  // 15 MINUTES
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,   // prevent from XSS attacks , cross-site scripting attacks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',  // prevents CSRF attacks, cross site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 DAYS
    });
};

export const signup = async (req, res) => {
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
        console.log('Error in signup controller', error.message);
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.isPasswordCorrect(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id);

            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            // remove password & refresh token field while sending response 
            const loginUser = await User.findById(user._id).select(
                "-password -cartItems"
            )

            res.status(201).json({ loginUser, message: "User logged in successfully" });
        }
        else{
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ message: error.message });
    }
};


export const logout = async (req, res) => {
    // While logout just del refreshToken from redis and clear the cookies
    try {
        const Token = req.cookies?.refreshToken;  // here refreshToken becoz we created cookie for refreshToken with this name
        if (!Token) {
            return res.status(401).json({ message: 'No refresh token found' });
        }
        // using verify function to decode the refreshToken
        const decoded = jwt.verify(Token, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_token:${decoded.userId}`);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout successfully' });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// will refresh the access token
export const refreshAccessToken = async (req, res) => {
    try {
       const token= req.cookies?.refreshToken;
       if(!token){
           return res.status(401).json({ message: 'No refresh token found' });
       }
       const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
       const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

       if(storedToken !== token){
           return res.status(401).json({ message: 'Invalid refresh token' });
       }
       // if rfereshToken is valid stored in redis, so lets create new accessToken
       const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

       res.cookie('accessToken', accessToken, {
           httpOnly: true,   // prevent from XSS attacks , cross-site scripting attacks
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',  // prevents CSRF attacks, cross site request forgery attack
           maxAge: 15 * 60 * 1000,  // 15 MINUTES
       });
       res.status(200).json({ message: 'Access token refreshed successfully' });
    } 
    catch (error) {
        console.log('Error in refreshAccessToken controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const getProfile = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log('Error in getProfile controller', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};