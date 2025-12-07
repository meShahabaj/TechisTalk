import jwt from "jsonwebtoken";
import User from "../../models/UserSchema.js";

export const checkAuthController = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.json({ auth: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        return res.json({ auth: true, user: user });
    } catch (err) {
        next(err);
    }
}