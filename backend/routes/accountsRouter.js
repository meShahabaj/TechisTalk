import express from "express";
import { getAllAccountsController } from "../controller/Accounts/getAllAccountsController.js";

const accountsRouter = express.Router();

// general accounts(users)
accountsRouter.get("/all", getAllAccountsController);

export default accountsRouter;
