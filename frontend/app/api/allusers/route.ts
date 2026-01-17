import User from "@/DB/models/userSchema";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const users = await User.find({
            isVerified: true
        });

        return new Response(JSON.stringify({ users }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: "Error fetching users" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
