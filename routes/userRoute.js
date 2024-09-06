import express from "express";
import {
	createUser,
	deleteUser,
	getAllUser,
	getUser,
	getUserTotalCount,
	updateUser,
} from "../controllers/userController.js";

import { checkRole } from "../utils/checkRole.js";

const UserRouter = express();

UserRouter.route("/").get(getAllUser);
UserRouter.route("/counts").get(getUserTotalCount);

UserRouter.route("/", checkRole("admin")).post(createUser);
UserRouter.route("/:id")
	.patch(checkRole("admin"), updateUser)
	.delete(checkRole("admin"), deleteUser)
	.get(checkRole("admin"), getUser);

export default UserRouter;
