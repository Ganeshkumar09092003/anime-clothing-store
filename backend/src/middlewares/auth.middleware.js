import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // check header exists 
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new ApiError(401, "Authentication required"); // Fixed typo
        }

        //expire token
        const token = authHeader.split(" ")[1];

        //verify token 
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

        // Attach user info to request
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new ApiError(401, "Invalid token"));
        } else if (error.name === 'TokenExpiredError') {
            next(new ApiError(401, "Token expired"));
        } else {
            next(error);
        }
    }
}