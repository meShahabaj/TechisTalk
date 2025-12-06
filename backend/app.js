import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import connectDB from "./config/DB.js";

dotenv.config();

const app = express();

// Connect database
connectDB();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

// Add cookie-parser middleware (must be before routes)
app.use(cookieParser());

app.use("/api/auth", authRouter);

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT}`);
});
