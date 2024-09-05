import express from "express";
import { login, registration } from "../controllers/auth.js"

const authRouter = express.Router();

authRouter.post("/register", registration);

authRouter.post("/login", login);

export default authRouter;
