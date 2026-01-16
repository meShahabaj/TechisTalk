import User from "@/DB/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
        const { fromUserId, toUserId } = await req.json();

        if (!fromUserId || !toUserId) {
            return NextResponse.json(
                { message: "Missing user IDs" },
                { status: 400 }
            );
        }

        if (fromUserId === toUserId) {
            return NextResponse.json(
                { message: "You can't send a request to yourself" },
                { status: 400 }
            );
        }

        const toUser = await User.findById(toUserId);

        if (!toUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const fromId = new mongoose.Types.ObjectId(fromUserId);

        // Already requested?
        if (toUser.friendRequests.some((id: any) => id.equals(fromId))) {
            return NextResponse.json(
                { message: "Friend request already sent" },
                { status: 400 }
            );
        }

        // Already friends?
        if (toUser.friends.some((id: any) => id.equals(fromId))) {
            return NextResponse.json(
                { message: "Already friends" },
                { status: 400 }
            );
        }

        // Push ObjectId directly
        toUser.friendRequests.push(fromId);
        await toUser.save();

        return NextResponse.json(
            { message: "Friend request sent" },
            { status: 200 }
        );
    } catch (error) {
        console.error("SEND FRIEND REQUEST ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
