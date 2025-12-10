import User from "../../models/UserSchema.js";
import jwt from "jsonwebtoken";

export const sendFriendRequest = async (req, res) => {
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

// ACCEPT FRIEND REQUEST
export const acceptRequest = async (req, res) => {
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

// REJECT FRIEND REQUEST
export const rejectRequest = async (req, res) => {
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

// GET FRIENDS
export const getFriends = async (req, res) => {
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

// REMOVE FRIEND
export const removeFriend = async (req, res) => {
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
