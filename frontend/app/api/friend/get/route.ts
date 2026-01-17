import User from "@/DB/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        /* =======================
           AUTH
        ======================= */
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

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
           FETCH USER
        ======================= */
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }


        /* =======================
           FETCH FRIEND DETAILS
        ======================= */
        const friendsDetails = await Promise.all(
            user.friends.map(async (friendId: mongoose.Types.ObjectId) => {
                const friend = await User.findById(friendId).select(
                    "username email"
                );

                return friend
                    ? {
                        id: friend._id.toString(),
                        username: friend.username,
                        email: friend.email,
                    }
                    : null;
            })
        );

        return NextResponse.json(
            { friends: friendsDetails.filter(Boolean) },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET FRIENDS ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
