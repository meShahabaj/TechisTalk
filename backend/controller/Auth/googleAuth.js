import jwt from "jsonwebtoken";
import User from "../../models/UserSchema.js";
import { OAuth2Client } from "google-auth-library";

// STEP 1: Redirect user to Google
export const googleAuthRedirect = (req, res) => {
    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    const redirectURL = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["profile", "email"],
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        client_id: process.env.GOOGLE_CLIENT_ID

    });

    res.redirect(redirectURL);
};

// STEP 2: Callback → verify token → login/signup user
export const googleAuthCallback = async (req, res) => {
    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    try {
        const { code } = req.query;
        if (!code) return res.status(400).send("No code provided");

        const { tokens } = await client.getToken({
            code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI
        });

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                username: payload.name,
                email,
                googleId: payload.sub,
            });
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect("http://localhost:3000");
    } catch (err) {
        console.error("Google authentication error:", err);
        res.status(500).json({ message: "Google authentication failed" });
    }
};
