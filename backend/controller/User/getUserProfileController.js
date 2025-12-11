import User from "../../models/UserSchema.js";

export const getUserProfileController = async (req, res) => {

    try {
        const userId = req.user._id;  // ID from auth middleware


        const user = await User.findById(userId).select("-password -__v");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            data: {
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error fetching profile:", error);

        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
};
