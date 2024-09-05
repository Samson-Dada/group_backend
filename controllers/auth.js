import Joi from "joi";
import { apiResponseCode } from "../helper.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";
import jwtToken from "../utils/JwtToken.js";

const registration = async (req, res) => {
	const registerSchema = Joi.object({
		fullName: Joi.string().required(),
		email: Joi.string().email().required(),
		phoneNumber: Joi.string().required(),
		username: Joi.string().required(),
		password: Joi.string().min(8).required(),
		role: Joi.string().valid("user", "admin").optional(),
	});

	try {
		// validate user/client request
		const { error } = registerSchema.validate(req.body);
		if (error) {
			return res.status(400).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseMessage: error.details[0].message,
				data: null,
			});
		}
		// destructure fields/values from the request body
		const { fullName, email, phoneNumber, username, password, role } = req.body;

		// Check if user with the email sent from the client already exist in the database
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseMessage: `${email} already exist`,
				data: null,
			});
		}

		// Hashing of password before saving to the database
		const hashPassword = await bcrypt.hash(password, 10);

		// create the information as a new user
		user = new User({
			fullName,
			email,
			phoneNumber,
			username,
			password: hashPassword,
			role,
		});

		// save the user to the database
		await user.save();

		const token = jwtToken(user); // to send token as part of the response
		res.status(201).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseMessage: `${email} registered successfully`,
			token: token,
			data: {
				fullName,
				email,
				phoneNumber,
				username,
				role,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
			responseMessage: "Internal server error",
			data: null,
		});
	}
};

// const login = async (req, res) => {
// 	const loginSchema = Joi.object({
// 		email: Joi.string().email().required(),
// 		password: Joi.string().required(),
// 	});

// 	try {
// 		// validate user/client request
// 		const { error } = loginSchema.validate(req.body);
// 		if (error) {
// 			return res.status(400).json({
// 				responseCode: apiResponseCode.BAD_REQUEST,
// 				responseMessage: error.details[0].message,
// 				data: null,
// 			});
// 		}

// 		// destructure fields/values from the request body
// 		const { email, password } = req.body;
// 		// find if the user email exist
// 		const user = await User.findOne({ email }).select("password");
// 		console.log(user);
// 		if (!user) {
// 			return res.status(400).json({
// 				responseCode: apiResponseCode.BAD_REQUEST,
// 				responseMessage: "Invalid credentials",
// 				data: null,
// 			});
// 		}

// 		// check if password sent matches the password on how database
// 		const isPasswordMatched = await bcrypt.compare(password, user.password);

// 		if (!isPasswordMatched) {
// 			return res.status(400).json({
// 				responseCode: apiResponseCode.BAD_REQUEST,
// 				responseMessage: "Invalid credentials",
// 				data: null,
// 			});
// 		}

// 		// create/sign a token that the  user can use to access protected routes and also make sure the token expires in one hour
// 		const token = jwt.sign(
// 			{ id: user._id, email: user.email },
// 			config.jwtSecret,
// 			{ expiresIn: "1h" }
// 		);
// 		user.password = undefined;
// 		res.status(200).json({
// 			responseCode: apiResponseCode.SUCCESSFUL,
// 			responseMessage: `${email} login successfully`,
// 			data: {
// 				token,
// 				user,
// 				fullName: user.fullName,
// 				email: user.email,
// 				phoneNumber: user.phoneNumber,
// 				username: user.username,
// 				role: user.role,
// 			},
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({
// 			responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
// 			responseMessage: "Internal server error",
// 			data: null,
// 		});
// 	}
// };

const login = async (req, res) => {
	const loginSchema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});

	try {
		// Validate user/client request
		const { error } = loginSchema.validate(req.body);
		if (error) {
			return res.status(400).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseMessage: error.details[0].message,
				data: null,
			});
		}

		// Destructure fields/values from the request body
		const { email, password } = req.body;

		// Find if the user email exists and select required fields
		const user = await User.findOne({ email }).select(
			"fullName email phoneNumber username role password"
		);
		// console.log("User:", user);

		if (!user) {
			return res.status(400).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseMessage: "Invalid credentials",
				data: null,
			});
		}

		// Check if password sent matches the password in the database
		const isPasswordMatched = await bcrypt.compare(password, user.password);
		// console.log("Password Matched:", isPasswordMatched);

		if (!isPasswordMatched) {
			return res.status(400).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseMessage: "Invalid credentials",
				data: null,
			});
		}

		// Create/sign a token that the user can use to access protected routes
		const token = jwt.sign(
			{ id: user._id, email: user.email },
			config.jwtSecret,
			{ expiresIn: "1h" }
		);
		// console.log("Token:", token);

		// Exclude the password from the response
		const { password: _, ...userWithoutPassword } = user.toObject();

		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseMessage: `${email} login successfully`,
			data: {
				token,
				user: userWithoutPassword,
			},
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
			responseMessage: "Internal server error",
			data: null,
		});
	}
};
/************************************/

const restrictedTo = (...roles) => {
	//console.log(...roles);
	return async (req, res) => {
		console.log(req.user);
		if (!roles.includes(req.user.role)) {
			console.log(req.user);
			console.log(req.user.role);
			return res.status(403).json({
				responseCode: apiResponseCode.UNAUTHORIZED,
				responseStatus: apiResponseStatus.FAILED,
				message:
					"Unauthorized access. This endpoint requires a different role.",
				data: null,
			});
		}
	};
};

export { registration, login, restrictedTo };
