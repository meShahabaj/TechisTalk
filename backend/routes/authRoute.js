import express from "express";
import { signup, verifyOtp } from "../controller/Auth/signupController.js";
import { login } from "../controller/Auth/loginController.js";
import { checkAuthController } from "../controller/Auth/checkAuthController.js";
import { logoutController } from "../controller/Auth/logoutController.js";
import { googleAuthCallback, googleAuthRedirect } from "../controller/Auth/googleAuth.js";
import { deleteUser } from "../controller/Auth/deleteUser.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/checkAuth", checkAuthController);
authRouter.post("/logout", logoutController);
authRouter.get("/google", googleAuthRedirect);           // redirect to Google
authRouter.get("/google/callback", googleAuthCallback);  // handle callback
authRouter.post("/verify-otp", verifyOtp)
authRouter.delete("/delete", deleteUser)

export default authRouter;
