// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function
export function middleware(req: NextRequest) {
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
