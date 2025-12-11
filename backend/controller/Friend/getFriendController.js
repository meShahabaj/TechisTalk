import User from "../../models/UserSchema.js";

// GET FRIENDS
export const getFriendController = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Fetch friend details from database
        const friendsDetails = await Promise.all(
            user.friends.map(async f => {
                const friend = await User.findById(f.id).select("username email");
                return friend ? { id: friend._id, username: friend.username, email: friend.email } : null;
            })
        );

        return res.json({ friends: friendsDetails.filter(f => f !== null) });

    } catch (err) {
        console.error("GET FRIENDS ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};