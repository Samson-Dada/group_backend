import dotenv from "dotenv";

dotenv.config();

export default {
	port: process.env.PORT || 8001,
	connectionString: process.env.CONNECTION_STRING,
	jwtSecret: process.env.JWT_SECRET,
};
