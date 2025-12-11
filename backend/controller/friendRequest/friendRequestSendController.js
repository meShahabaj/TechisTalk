import User from "../../models/UserSchema.js";

export const friendRequestSendController = async (req, res) => {
    try {
        const { fromUserId, toUserId } = req.body;

        if (toUserId === fromUserId) {
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) return res.status(404).json({ message: "User not found" });

        // Check if request already exists
        const alreadyRequested = toUser.friendRequests.some(
            (req) => req.id === fromUserId
        );
        if (alreadyRequested) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Check if they are already friends
        const alreadyFriends = toUser.friends.some(
            (friend) => friend.id === fromUserId
        );
        if (alreadyFriends) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Push new friend request
        toUser.friendRequests.push({ id: fromUserId });
        await toUser.save();

        return res.json({ message: "Friend request sent" });
    } catch (err) {
        console.error("SEND FRIEND REQUEST ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};