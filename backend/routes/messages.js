import express from "express";
import message from "../models/message.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { user1, user2 } = req.query;

        if (!user1 || !user2) {
            return res.status(400).json({ error: "Missing users" });
        }

        const messages = await message.find({
            $or: [
                { from: user1, to: user2 },
                { from: user2, to: user1 }
            ]
        }).sort({ timestamp: 1 });

        res.json({ messages });
    } catch (err) {
        res.status(500).json({ error: "Failed to load messages" });
    }
});

export default router;
