import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

// STEP 1: Redirect user to Google
export const GET = async (req: NextRequest) => {
    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const redirectURL = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["profile", "email"],
    });

    return NextResponse.redirect(redirectURL);
};
