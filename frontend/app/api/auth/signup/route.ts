// app/api/auth/signup/route.js
import User from "@/DB/models/userSchema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import sendotp from "../sendotp";
import { connectToDB } from "@/DB/connectToDB";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 409 }
            );
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
            await sendotp(email, "Techis Talk Otp", `Your otp is: ${otp}`);

            return NextResponse.json(
                {
                    message: "OTP resent to your email",
                    userId: existingUser._id,
                },
                { status: 200 }
            );
        }

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        // Send OTP via email
        await sendotp(email, "Techis Talk Otp", `Your otp is: ${otp}`);

        return NextResponse.json(
            {
                message: "OTP sent to your email",
                userId: newUser._id,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
