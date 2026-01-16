import User from "@/DB/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        /* =======================
           AUTH: READ TOKEN
        ======================= */
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        /* =======================
           VERIFY JWT
        ======================= */
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
        };

        const userId = decoded.id;

        if (!userId) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 400 }
            );
        }

        /* =======================
           FETCH FRIEND REQUESTS
        ======================= */
        const user = await User.findById(userId).select("friendRequests");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        /* =======================
           POPULATE REQUEST USERS
        ======================= */
        const requestsWithUser = await Promise.all(
            user.friendRequests.map(async (fromId: mongoose.Types.ObjectId) => {
                const fromUser = await User.findById(fromId).select(
                    "username email"
                );

                return fromUser
                    ? {
                        from: {
                            id: fromUser._id.toString(),
                            username: fromUser.username,
                            email: fromUser.email,
                        },
                    }
                    : null;
            })
        );

        return NextResponse.json(
            { requests: requestsWithUser.filter(Boolean) },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET FRIEND REQUEST ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
