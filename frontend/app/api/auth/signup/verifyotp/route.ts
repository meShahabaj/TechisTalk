import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/DB/connectToDB";
import User from "@/DB/models/userSchema";

interface VerifyOtpBody {
    userId: string;
    otp: string;
}

export const POST = async (req: NextRequest) => {
    const isProduction = process.env.NODE_ENV === "production";

    try {
        await connectToDB();

        const body: VerifyOtpBody = await req.json();
        const { userId, otp } = body;

        if (!userId || !otp) {
            return NextResponse.json(
                { message: "userId and otp are required" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: "User already verified" },
                { status: 400 }
            );
        }

        if (!user.otp || !user.otpExpires) {
            return NextResponse.json(
                { message: "OTP not found or expired" },
                { status: 400 }
            );
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return NextResponse.json(
                { message: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id.toString(), email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            message: "Email verified successfully",
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
        });

        // Set auth cookie
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60, // seconds
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("VERIFY OTP ERROR:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
