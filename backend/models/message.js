import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Number, default: Date.now },
}, { timestamps: true });

MessageSchema.index({ from: 1, to: 1 });

const message = mongoose.models.Message ||
    mongoose.model("Message", MessageSchema);

export default message;
