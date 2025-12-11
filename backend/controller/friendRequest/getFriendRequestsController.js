import User from "../../models/UserSchema.js";

export const getFriendRequestsController = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch current user's friendRequests
        const user = await User.findById(userId).select("friendRequests");
        if (!user) return res.status(404).json({ message: "User not found" });

        const friendRequests = user.friendRequests;

        // Map friendRequests to include user details
        const requestsWithUser = await Promise.all(
            friendRequests.map(async (reqItem) => {
                const fromUser = await User.findById(reqItem.id).select("username email");
                return {
                    from: fromUser
                        ? { id: fromUser._id, username: fromUser.username, email: fromUser.email }
                        : null,
                };
            })
        );

        return res.json({ requests: requestsWithUser });
    } catch (err) {
        console.error("GET FRIEND REQUEST ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
