import express from "express";
import { getAllAccountsController } from "../controller/Accounts/getAllAccountsController.js";
import { getAccountByIdController } from "../controller/Accounts/getAccountByIdController.js";

const accountsRouter = express.Router();

// general accounts(users)
accountsRouter.get("/all", getAllAccountsController);
accountsRouter.get("/findById/:id", getAccountByIdController);

export default accountsRouter;
