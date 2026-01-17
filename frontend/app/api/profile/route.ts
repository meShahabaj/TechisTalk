import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/DB/models/userSchema";
import { connectToDB } from "@/DB/connectToDB";

interface DecodedToken extends JwtPayload {
    id: string;
}

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
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
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        const user = await User.findById(decoded.id).select("-password -__v");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                data: {
                    username: user.username,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            {
                message: "Internal server error",
                error: error.message,
            },
            { status: 500 }
        );
    }
};


export async function DELETE(req: NextRequest) {
    try {
        /* =======================
           READ TOKEN FROM COOKIE
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
           DELETE USER
        ======================= */
        await User.findByIdAndDelete(userId);

        /* =======================
           CLEAR COOKIE
        ======================= */
        const response = NextResponse.json(
            { message: "Account deleted successfully" },
            { status: 200 }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Delete error:", error);

        return NextResponse.json(
            { message: "Failed to delete account" },
            { status: 500 }
        );
    }
}
export async function PUT(req: NextRequest) {
    try {
        await connectToDB();

        /* =======================
           READ TOKEN
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
        let decoded: DecodedToken;
        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as DecodedToken;
        } catch {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        /* =======================
           READ FORM DATA
        ======================= */
        const formData = await req.formData();
        const username = formData.get("username") as string;

        if (!username || username.trim().length < 1) {
            return NextResponse.json(
                { message: "Invalid username" },
                { status: 400 }
            );
        }

        /* =======================
           UPDATE USER
        ======================= */
        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            { username },
            { new: true }
        ).select("-password -__v");

        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Profile updated successfully",
                data: {
                    username: updatedUser.username
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json(
            { message: "Failed to update profile" },
            { status: 500 }
        );
    }
}
