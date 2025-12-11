import express from "express";
import { signup, verifyOtp } from "../controller/Auth/signupController.js";
import { login } from "../controller/Auth/loginController.js";
import { logoutController } from "../controller/Auth/logoutController.js";
import { googleAuthCallback, googleAuthRedirect } from "../controller/Auth/googleAuthController.js";
import { checkAuthMiddleware } from "../middleware/checkAuthMiddleware.js";
import { checkAuthController } from "../controller/Auth/checkAuthController.js";

const authRouter = express.Router();

// Authentication related routes
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/checkAuth", checkAuthController);
authRouter.post("/logout", checkAuthMiddleware, logoutController);
authRouter.get("/google", googleAuthRedirect);           // redirect to Google
authRouter.get("/google/callback", googleAuthCallback);  // handle callback
authRouter.post("/verify-otp", verifyOtp)

export default authRouter;
