import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";

export const checkAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ auth: false, message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ auth: false, message: "User not found" });
        }

        // Attach user to request
        req.user = user;

        next();  // continue to next route handler
    } catch (err) {
        return res.status(401).json({ auth: false, message: "Invalid token" });
    }
};
