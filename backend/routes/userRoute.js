import express from "express";
import { getAllUsers } from "../controller/Users/getAllUsers.js";
import { acceptRequest, getFriends, rejectRequest, removeFriend, sendFriendRequest } from "../controller/Users/friendController.js";
import { getUserProfileById } from "../controller/User/getUserProfileById.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { getFriendRequests } from "../controller/Users/getFriendRequests.js";
const userRouter = express.Router();

userRouter.get("/all", getAllUsers);
userRouter.post("/requests/send", checkAuth, sendFriendRequest);
userRouter.get("/requests", checkAuth, getFriendRequests);
userRouter.post("/accept", checkAuth, acceptRequest);
userRouter.post("/reject", checkAuth, rejectRequest);
userRouter.get("/friends", checkAuth, getFriends);
userRouter.post("/remove-friend", checkAuth, removeFriend);
userRouter.get("/profile", checkAuth, getUserProfileById);

export default userRouter;
