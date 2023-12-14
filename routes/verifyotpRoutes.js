import express from "express";
import { verifyOtp } from "../controllers/verifyotpController.js";

const verifyRouter = express.Router();

verifyRouter.get("/", verifyOtp);

export default verifyRouter;