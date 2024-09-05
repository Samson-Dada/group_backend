import express from "express";
import {
	getAllUser,
	getUserTotalCount,
} from "../controllers/userController.js";

import { restrictedTo } from "../controllers/auth.js";
const UserRouter = express();

UserRouter.route("/").get(getAllUser);
UserRouter.route("/counts").get(getUserTotalCount);

export default UserRouter;
