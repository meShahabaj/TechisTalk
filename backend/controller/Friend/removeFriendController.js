import User from "../../models/UserSchema.js";

// REMOVE FRIEND
export const removeFriendController = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ message: "Friend not found" });

        // Remove from both friend lists
        user.friends = user.friends.filter(f => f.id !== friendId);
        friend.friends = friend.friends.filter(f => f.id !== userId.toString());

        await user.save();
        await friend.save();

        return res.json({ message: "Friend removed" });

    } catch (err) {
        console.error("REMOVE FRIEND ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
