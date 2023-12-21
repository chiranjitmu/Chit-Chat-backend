import express from "express";
import { sendmailController } from "../controllers/sendmailController.js";
import auth from "../middleware/authenticate.js";

const sendmailRouter = express.Router();

sendmailRouter.get("/", auth, sendmailController);

export default sendmailRouter;
