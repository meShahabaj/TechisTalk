import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import { sendOtp } from "./sendOtp.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isVerified) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        if (existingUser && !existingUser.isVerified) {
            existingUser.username = username;
            existingUser.password = hashedPassword;
            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;

            await existingUser.save();
            await sendOtp(email, otp);

            return res.status(200).json({
                message: "OTP resent to your email",
                userId: existingUser._id
            });
        }

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });


        // Send OTP via email
        await sendOtp(email, otp);

        res.status(201).json({
            message: "OTP sent to your email",
            userId: newUser._id,
        });
    } catch (err) {
        next(err);
    }
};
export const verifyOtp = async (req, res, next) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT token after verification
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Email verified successfully",
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) {
        next(err);
    }
};
