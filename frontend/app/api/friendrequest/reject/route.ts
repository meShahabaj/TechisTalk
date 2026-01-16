import User from "@/DB/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
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
           BODY
        ======================= */
        const { fromUserId } = await req.json();

        if (!fromUserId) {
            return NextResponse.json(
                { message: "Missing fromUserId" },
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

        const fromObjectId = new mongoose.Types.ObjectId(fromUserId);

        /* =======================
           REMOVE FRIEND REQUEST
        ======================= */
        user.friendRequests = user.friendRequests.filter(
            (id: any) => !id.equals(fromObjectId)
        );

        await user.save();

        return NextResponse.json(
            { message: "Friend request rejected" },
            { status: 200 }
        );
    } catch (error) {
        console.error("REJECT REQUEST ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
