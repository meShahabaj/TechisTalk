import express from "express";
import { getUserProfileController } from "../controller/User/getUserProfileController.js";
import { checkAuthMiddleware } from "../middleware/checkAuthMiddleware.js";
import { deleteUserController } from "../controller/User/deleteUserController.js";
const userRouter = express.Router();

userRouter.get("/profile", checkAuthMiddleware, getUserProfileController);
userRouter.delete("/delete", checkAuthMiddleware, deleteUserController)

export default userRouter;
