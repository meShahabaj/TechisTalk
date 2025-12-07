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

        // Check already requested
        const alreadyRequested = toUser.friendRequests.some(
            (req) => req.from.toString() === fromUserId
        );

        if (alreadyRequested) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Check already friends
        if (toUser.friends.includes(fromUserId)) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Push friend request
        toUser.friendRequests.push({ from: fromUserId });
        await toUser.save();

        res.json({ message: "Friend request sent" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getFriendRequests = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user + populate friend requests
        const user = await User.findById(decoded.id)
            .populate("friendRequests.from", "username email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ requests: user.friendRequests });

    } catch (err) {
        console.error("GET FRIEND REQUEST ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};



export const acceptRequest = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { fromUserId } = req.body;

        const user = await User.findById(userId);
        const fromUser = await User.findById(fromUserId);

        if (!fromUser) return res.status(404).json({ message: "User not found" });

        // Add each other as friends
        if (!user.friends.includes(fromUserId)) user.friends.push(fromUserId);
        if (!fromUser.friends.includes(userId)) fromUser.friends.push(userId);

        // Remove friend request
        user.friendRequests = user.friendRequests.filter(
            (req) => req.from.toString() !== fromUserId
        );

        await user.save();
        await fromUser.save();

        return res.json({ message: "Friend request accepted" });

    } catch (err) {
        console.error("ACCEPT REQUEST ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
export const rejectRequest = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { fromUserId } = req.body;

        const user = await User.findById(userId);

        user.friendRequests = user.friendRequests.filter(
            (req) => req.from.toString() !== fromUserId
        );

        await user.save();

        return res.json({ message: "Friend request rejected" });

    } catch (err) {
        console.error("REJECT REQUEST ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


export const getFriends = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)

        const user = await User.findById(decoded.id)
            .populate("friends", "username email");

        if (!user) return res.status(404).json({ message: "User not found" });

        console.log(user)

        return res.json({ friends: user.friends });

    } catch (err) {
        console.error("GET FRIENDS ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


export const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        // Remove from both friend lists
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        return res.json({ message: "Friend removed" });

    } catch (err) {
        console.error("REMOVE FRIEND ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
