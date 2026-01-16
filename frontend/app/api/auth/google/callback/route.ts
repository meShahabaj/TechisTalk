import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectToDB } from "@/DB/connectToDB";
import User from "@/DB/models/userSchema";

export const GET = async (req: NextRequest) => {
    const isProduction = process.env.NODE_ENV === "production";

    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    try {
        await connectToDB();

        // ✅ Get code from URL (NOT req.query)
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.json(
                { message: "No code provided" },
                { status: 400 }
            );
        }

        // ✅ Exchange code for tokens
        const { tokens } = await client.getToken({
            code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        });

        if (!tokens.id_token) {
            return NextResponse.json(
                { message: "No ID token received" },
                { status: 400 }
            );
        }

        // ✅ Verify Google ID token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.email) {
            return NextResponse.json(
                { message: "Invalid Google payload" },
                { status: 400 }
            );
        }

        // ✅ Find or create user
        let user = await User.findOne({ email: payload.email });

        if (!user) {
            user = await User.create({
                username: payload.name,
                email: payload.email,
                googleId: payload.sub,
                isVerified: true,
            });
        }

        // ✅ Issue JWT
        const token = jwt.sign(
            { id: user._id.toString(), email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        // ✅ Redirect with cookie set
        const response = NextResponse.redirect(
            process.env.FRONTEND_API as string
        );

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
        console.error("Google authentication error:", error);
        return NextResponse.json(
            { message: "Google authentication failed" },
            { status: 500 }
        );
    }
};
