import jwt from "jsonwebtoken";
import config from "../config.js";

const generateToken = (user, secret = config.jwtSecret, expiresIn = "1h") => {
	return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn });
};
export default generateToken;
