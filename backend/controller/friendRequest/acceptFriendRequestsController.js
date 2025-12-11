import User from "../../models/UserSchema.js";

// ACCEPT FRIEND REQUEST
export const acceptFriendRequestsController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fromUserId } = req.body;

        const user = await User.findById(userId);
        const fromUser = await User.findById(fromUserId);

        console.log(fromUserId)

        if (!fromUser) return res.status(404).json({ message: "User not found" });

        // Add each other as friends if not already
        if (!user.friends.some(f => f.id === fromUserId)) user.friends.push({ id: fromUserId });
        if (!fromUser.friends.some(f => f.id === userId.toString())) fromUser.friends.push({ id: userId.toString() });

        // Remove friend request
        user.friendRequests = user.friendRequests.filter(
            req => req.id !== fromUserId
        );

        await user.save();
        await fromUser.save();

        return res.json({ message: "Friend request accepted" });

    } catch (err) {
        console.error("ACCEPT REQUEST ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};