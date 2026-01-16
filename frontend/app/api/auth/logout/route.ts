import { NextResponse } from "next/server";

export const POST = async () => {
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
    );

    // Clear auth cookie
    response.cookies.set({
        name: "token",
        value: "",
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 0,
        path: "/",
    });

    return response;
};
