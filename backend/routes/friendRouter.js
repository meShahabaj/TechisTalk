import express from "express";
import { removeFriendController } from "../controller/Friend/removeFriendController.js";
import { checkAuthMiddleware } from "../middleware/checkAuthMiddleware.js";
import { getFriendController } from "../controller/Friend/getFriendController.js";

const friendRouter = express.Router();

friendRouter.get("/get", checkAuthMiddleware, getFriendController);
friendRouter.post("/remove", checkAuthMiddleware, removeFriendController);

export default friendRouter;
