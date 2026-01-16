import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/DB/models/userSchema";
import { connectToDB } from "@/DB/connectToDB";

interface DecodedToken extends JwtPayload {
    id: string;
}

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { auth: false },
                { status: 200 }
            );
        }

        let decoded: DecodedToken;

        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as DecodedToken;
        } catch {
            return NextResponse.json(
                { auth: false },
                { status: 200 }
            );
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return NextResponse.json(
                { auth: false },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                auth: true,
                user: {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    friends: user.friends,
                    friendRequests: user.friendRequests,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("AUTH CHECK ERROR:", error);
        return NextResponse.json(
            { auth: false },
            { status: 500 }
        );
    }
};
