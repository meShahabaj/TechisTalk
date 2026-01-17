// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API
const FRONTEND_API = process.env.NEXT_PUBLIC_FRONTEND_API

const ALLOWED_ORIGINS = [
    BACKEND_API, FRONTEND_API
];


// Middleware function
export function proxy(req: NextRequest) {
    const origin = req.headers.get("origin");

    // If it's a CORS request
    if (origin) {
        if (!ALLOWED_ORIGINS.includes(origin)) {
            return NextResponse.json(
                { error: "Origin not allowed" },
                { status: 403 }
            );
        }
    }

    // Get token from cookies (HttpOnly)
    const token = req.cookies.get("token")?.value;

    // If no token, redirect to login page
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If token exists, continue to the requested page
    return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
    matcher: [
        "/((?!login|signup|_next|api).*)", // negative lookahead
    ]
};
