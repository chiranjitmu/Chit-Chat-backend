import express from "express";
import { resendOtp } from "../controllers/resendotpController.js";

const resendRouter = express.Router();

resendRouter.get("/", resendOtp);

export default resendRouter;