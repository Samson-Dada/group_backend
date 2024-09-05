import User from "../models/User.js";
import { apiResponseCode, apiResponseStatus } from "../helper.js";

export const getAllUser = async (req, res) => {
	try {
		const users = await User.find();
		const filteredRole = users.filter((user) => user.role === "user");
		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			totalCount: users.length,
			message: "Success",
			filteredRole,
		});
	} catch (err) {
		res.status(400).json({
			responseCode: apiResponseCode.BAD_REQUEST,
			apiResponseStatus: apiResponseStatus.FAILED,
			message: `Error ${err}`,
			data: null,
		});
	}
};

export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!product) {
			return res.status(404).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: "User not found",
			});
		}
		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			responseMessage: apiResponseMessage.SUCCESS,
			data: { user },
		});
	} catch (err) {
		res.status(500).json({
			responseCode: apiResponseCode.BAD_REQUEST,
			apiResponseStatus: apiResponseStatus.FAILED,
			message: `Error ${err}`,
		});
	}
};

export const updateUser = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!user) {
			return res.status(404).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: "User with the specified ID not found",
			});
		}

		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			responseMessage: "User updated successfully",
			data: { user },
		});
	} catch (err) {
		res.status(500).json({
			responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
			responseStatus: apiResponseStatus.FAILED,
			message: `Error: ${err.message}`,
		});
	}
};

export const deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: "User with the specified ID not found",
			});
		}
		res.status(204).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			responseMessage: "User deleted successfully",
		});
	} catch (err) {
		res.status(500).json({
			responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
			responseStatus: apiResponseStatus.FAILED,
			message: `Error: ${err.message}`,
		});
	}
};

export const getUserTotalCount = async (req, res) => {
	try {
		const totalCount = await User.countDocuments();
		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			message: "Total user count retrieved successfully",
			totalCount: totalCount,
		});
	} catch (err) {
		res.status(500).json({
			responseCode: "05",
			responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
			responseStatus: apiResponseStatus.FAILED,
			message: `Error: ${err.message}`,
		});
	}
};
