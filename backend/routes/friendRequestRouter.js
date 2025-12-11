import express from "express";
import { friendRequestSendController }
    from "../controller/friendRequest/friendRequestSendController.js";
import { getFriendRequestsController } from
    "../controller/friendRequest/getFriendRequestsController.js";
import { acceptFriendRequestsController } from
    "../controller/friendRequest/acceptFriendRequestsController.js";
import { rejectFriendRequestsController } from
    "../controller/friendRequest/rejectFriendRequestsController.js";
import { checkAuthMiddleware } from "../middleware/checkAuthMiddleware.js";

const friendRequestRouter = express.Router();

friendRequestRouter.post("/send", checkAuthMiddleware, friendRequestSendController);
friendRequestRouter.get("/get", checkAuthMiddleware, getFriendRequestsController);
friendRequestRouter.post("/accept", checkAuthMiddleware, acceptFriendRequestsController);
friendRequestRouter.post("/reject", checkAuthMiddleware, rejectFriendRequestsController);

export default friendRequestRouter;
