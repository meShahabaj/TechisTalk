import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/DB/models/userSchema";
import { connectToDB } from "@/DB/connectToDB";

interface LoginBody {
    email: string;
    password: string;
}

export const POST = async (req: NextRequest) => {
    const isProduction = process.env.NODE_ENV === "production";

    try {
        await connectToDB();

        const body: LoginBody = await req.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id.toString(),
                email: user.email,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
            },
        });

        // Set cookie
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: isProduction, // true in production (HTTPS)
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60, // seconds
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
