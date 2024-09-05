import express from "express";
import {
	deleteUser,
	getAllUser,
	getUser,
	getUserTotalCount,
	updateUser,
} from "../controllers/userController.js";

import { restrictedTo } from "./../utils/CheckRole.js";
const UserRouter = express();

UserRouter.route("/").get(getAllUser);
UserRouter.route("/counts").get(getUserTotalCount);

UserRouter.route("/:id")
	.patch(restrictedTo("admin"), updateUser)
	.delete(restrictedTo("admin"), deleteUser).get(restrictedTo('admin'), getUser);

export default UserRouter;
