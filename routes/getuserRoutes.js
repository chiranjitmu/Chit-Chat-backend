import express from "express";
import { getuser } from "../controllers/getuserController.js"
import auth from "../middleware/authenticate.js"

const getuserRouter = express.Router()

getuserRouter.get("/", auth, getuser)

export default getuserRouter;