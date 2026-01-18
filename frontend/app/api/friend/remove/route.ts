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
        const { friendId } = await req.json();


        if (!friendId) {
            return NextResponse.json(
                { message: "Friend ID is required" },
                { status: 400 }
            );
        }

        /* =======================
           FETCH USERS
        ======================= */
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);


        if (!user || !friend) {
            return NextResponse.json(
                { message: "Friend not found" },
                { status: 404 }
            );
        }

        /* =======================
           REMOVE FRIEND
        ======================= */
        const friendObjId = new mongoose.Types.ObjectId(friendId);
        const userObjId = new mongoose.Types.ObjectId(userId);
        user.friends = user.friends.filter(
            (f: any) => !f._id.equals(friendObjId)
        );

        friend.friends = friend.friends.filter(
            (f: any) => !f._id.equals(userObjId)
        );


        await user.save();
        await friend.save();

        return NextResponse.json(
            { message: "Friend removed" },
            { status: 200 }
        );
    } catch (error) {
        console.error("REMOVE FRIEND ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
