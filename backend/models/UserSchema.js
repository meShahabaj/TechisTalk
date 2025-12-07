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
            // Only required for regular signup users
        },

        googleId: {
            type: String,
            // Only present if the user signed up with Google
        },

        refreshToken: {
            type: String,
            // Optional: store refresh token for session management
        },
        otp: { type: String },
        otpExpires: { type: Date },

        isVerified: {
            type: Boolean,
            default: false,
            // Optional: email verification for regular signup
        },
    },
    { timestamps: true }
);

// Optional: prevent sending sensitive fields in responses
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

export default mongoose.model("User", userSchema);