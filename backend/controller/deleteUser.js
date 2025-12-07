import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";

export const deleteUser = async (req, res) => {

    try {
        // 1. Read token from cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // 2. Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Extract user ID
        const userId = decoded.id;

        if (!userId) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // 4. Delete user from DB
        await User.findByIdAndDelete(userId);

        // 5. Clear cookie
        res.clearCookie("token");

        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Failed to delete account" });
    }
};
