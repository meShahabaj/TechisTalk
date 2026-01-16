import User from "@/DB/models/userSchema";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;
        console.log(id)

        if (!id) {
            return new Response(JSON.stringify({ message: "Missing user ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Make sure id is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "Invalid user ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await User.findById(id).select("-password"); // exclude password

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        return new Response(JSON.stringify({ message: "Error fetching user" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
