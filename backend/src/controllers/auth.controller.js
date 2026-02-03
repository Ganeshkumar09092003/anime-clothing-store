import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";
import RefreshToken from '../models/RefreshToken.model.js'
import { ApiError } from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { hashToken } from '../utils/hash.js';
import { env } from '../config/env.js';

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, "Email already registered");
        }

        const user = await User.create({
            name, email, password
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input 
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Find User
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new ApiError(401, "Invalid credentials");
        }

        // compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials")
        }

        // Generate access token
        const accessToken = generateAccessToken({
            userId: user._id,
            role: user.role,
        })

        const refreshToken = generateRefreshToken({
            userId: user._id,
        })

        //Store hashed refresh token
        await RefreshToken.create({
            user: user.id,
            token: hashToken(refreshToken),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        // send response

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });

    } catch (error) {
        next(error)
    }
};

export const refreshUser = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
        const hashedToken = hashToken(token);

        const storedToken = await RefreshToken.findOne({
            user: payload.userId,
            token: hashedToken,
            revoked: false,
        });

        if (!storedToken) {
            // 🚨 Possible token reuse attack
            await RefreshToken.updateMany(
                { user: payload.userId },
                { revoked: true }
            );
            throw new ApiError(403, "Session compromised");
        }

        // Rotate token
        storedToken.revoked = true;
        await storedToken.save();

        // Get user to include role in new access token
        const user = await User.findById(payload.userId);
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        const newAccessToken = generateAccessToken({
            userId: payload.userId,
            role: user.role,
        });

        const newRefreshToken = generateRefreshToken({
            userId: payload.userId,
        });

        await RefreshToken.create({
            user: payload.userId,
            token: hashToken(newRefreshToken),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        next(error)
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const hashed = hashToken(token);
            await RefreshToken.updateOne(
                { token: hashed },
                { revoked: true }
            );
        }

        res.clearCookie("refreshToken");

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};
