import express from "express";
import { userlist } from "../controllers/getuserlistController.js";
import auth from "../middleware/authenticate.js";

const getuserlistRouter = express.Router();

getuserlistRouter.get("/", auth, userlist);

export default getuserlistRouter;
