import User from "../../models/UserSchema.js";

// REJECT FRIEND REQUEST
export const rejectFriendRequestsController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fromUserId } = req.body;

        const user = await User.findById(userId);

        user.friendRequests = user.friendRequests.filter(
            req => req.id !== fromUserId
        );

        await user.save();

        return res.json({ message: "Friend request rejected" });

    } catch (err) {
        console.error("REJECT REQUEST ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
