import express from "express";
import { message } from "../controllers/getmessageController.js";
import auth from "../middleware/authenticate.js";

const getmessageRouter = express.Router();

getmessageRouter.get("/", auth, message);

export default getmessageRouter;
