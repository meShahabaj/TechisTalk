import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";
import http from "http";
import url from "url";

import authRouter from "./routes/authRoute.js";
import connectDB from "./config/DB.js";
import userRouter from "./routes/userRoute.js";
import accountsRouter from "./routes/accountsRouter.js";
import friendRequestRouter from "./routes/friendRequestRouter.js";
import friendRouter from "./routes/friendRouter.js";

dotenv.config();

const app = express();

// Connect database
connectDB();

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "https://techistalk.onrender.com"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/accounts", accountsRouter);
app.use("/user", userRouter);
app.use("/friend-request", friendRequestRouter);
app.use("/friend", friendRouter);

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server (manual upgrade)
const wss = new WebSocketServer({ noServer: true });

// Map to track user -> socket
const userSockets = new Map();
const onlineUsers = new Set();

// Allow only /chat-socket route
server.on("upgrade", (req, socket, head) => {
    if (req.url.startsWith("/chat-socket")) {      // <- FIXED
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
        });
    } else {
        socket.destroy();
    }
});

// Send message to a specific user
function sendToUser(userId, message) {
    const ws = userSockets.get(userId);
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(message);
    }
}

function broadcastStatus(userId, status) {
    const payload = JSON.stringify({
        type: "status",
        userId,
        status
    });

    userSockets.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(payload);
        }
    });
}


// WebSocket Connection Logic
wss.on("connection", (ws, req) => {
    const query = url.parse(req.url, true).query;
    const userId = query.userId;

    onlineUsers.add(userId);

    console.log(`User connected: ${userId}`);

    // Save socket
    userSockets.set(userId, ws);

    // Confirm connection
    ws.send(JSON.stringify({ type: "status", status: "online", userId }));
    broadcastStatus(userId, "online");

    // Handle client messages
    ws.on("message", (msg) => {
        console.log(`Message from ${userId}:`, msg.toString());

        // Example: expect JSON
        try {
            const data = JSON.parse(msg.toString());
            const { type, to, text, timestamp } = data;

            // Handle typing indicator
            if (type === "typing") {
                sendToUser(to, JSON.stringify({
                    type: "typing",
                    from: userId
                }));
                return;
            }

            if (type === "stop_typing") {
                sendToUser(to, JSON.stringify({
                    type: "stop_typing",
                    from: userId
                }));
                return;
            }


            // Send message to a specific user
            sendToUser(to, JSON.stringify({
                from: userId,
                text, timestamp, type: "message"
            }));
        } catch (e) {
            console.log("Invalid message format");
        }
    });

    // Remove user on disconnect
    ws.on("close", () => {
        userSockets.delete(userId);
        onlineUsers.delete(userId);
        console.log("User disconnected:", userId);
        broadcastStatus(userId, "offline");
    });
});

// Start server
server.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT}`);
});
