import express from "express";
import { getAllUsers } from "../controller/Users/getAllUsers.js";
import { acceptRequest, getFriendRequests, getFriends, rejectRequest, removeFriend, sendFriendRequest } from "../controller/Users/friendController.js";
const usersRouter = express.Router();

usersRouter.get("/all", getAllUsers);
usersRouter.post("/send", sendFriendRequest);
usersRouter.get("/requests", getFriendRequests);
usersRouter.post("/accept", acceptRequest);
usersRouter.post("/reject", rejectRequest);
usersRouter.get("/friends", getFriends);
usersRouter.post("/remove-friend", removeFriend);

export default usersRouter;
