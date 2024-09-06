import Product from "../models/Products.js";
import { apiResponseCode, apiResponseStatus } from "../helper.js";

export const getAllProduct = async (req, res) => {
	try {
		const product = await Product.find();
		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			totalCount: product.length,
			message: "Success",
			data: { product },
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

export const createProduct = async (req, res) => {
	try {
		const newProduct = await Product.create(req.body);
		res.status(201).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			responseMessage: "Product created successfully",
			data: { newProduct },
		});
	} catch (err) {
		if (err.code === 11000) {
			const duplicateField = Object.keys(err.keyValue)[0];
			res.status(400).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: `The ${duplicateField} '${err.keyValue[duplicateField]}' is already in use. Please choose a different one.`,
			});
		} else {
			res.status(400).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: `Error: ${err.message}`,
			});
		}
	}
};

export const getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: "Product not found",
			});
		}
		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			responseMessage: "success",
			data: { product },
		});
	} catch (err) {
		res.status(500).json({
			responseCode: apiResponseCode.BAD_REQUEST,
			apiResponseStatus: apiResponseStatus.FAILED,
			message: `Error ${err}`,
		});
	}
};

export const updateProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!product) {
			return res.status(404).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: "Product with the specified ID not found",
			});
		}

		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			responseMessage: "Product updated successfully",
			data: { product },
		});
	} catch (err) {
		res.status(500).json({
			responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
			responseStatus: apiResponseStatus.FAILED,
			message: `Error: ${err.message}`,
		});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return res.status(404).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: "Product with the specified ID not found",
			});
		}
		res.status(204).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			responseMessage: "Product deleted successfully",
		});
	} catch (err) {
		res.status(500).json({
			responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
			responseStatus: apiResponseStatus.FAILED,
			message: `Error: ${err.message}`,
		});
	}
};

export const getProductTotalCount = async (req, res) => {
	try {
		const totalCount = await Product.countDocuments();
		res.status(200).json({
			responseCode: apiResponseCode.SUCCESSFUL,
			responseStatus: apiResponseStatus.SUCCESS,
			message: "Total count retrieved successfully",
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
