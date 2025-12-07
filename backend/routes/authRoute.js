import express from "express";
import { signup, verifyOtp } from "../controller/signupController.js";
import { login } from "../controller/loginController.js";
import { checkAuthController } from "../controller/checkAuthController.js";
import { logoutController } from "../controller/logoutController.js";
import { googleAuthCallback, googleAuthRedirect } from "../controller/googleAuth.js";
import { deleteUser } from "../controller/deleteUser.js";

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
