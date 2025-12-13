import User from "../../models/UserSchema.js";

export const getAccountByIdController = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("_id username email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
};
