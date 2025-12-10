import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
        },

        googleId: {
            type: String,
        },

        refreshToken: {
            type: String,
        },

        otp: { type: String },
        otpExpires: { type: Date },

        friendRequests: [
            {
                id: { type: String },
                createdAt: { type: Date, default: Date.now },
            }
        ],

        friends: [
            {
                id: { type: String },
                createdAt: { type: Date, default: Date.now },
            }
        ],

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Prevent sending sensitive info
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

export default mongoose.model("User", userSchema);
