import express from "express";
import { signup } from "../controller/signupController.js";
import { login } from "../controller/loginController.js";
import { checkAuthController } from "../controller/checkAuthController.js";
import { logoutController } from "../controller/logoutController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/checkAuth", checkAuthController);
authRouter.post("/logout", logoutController);

export default authRouter;
