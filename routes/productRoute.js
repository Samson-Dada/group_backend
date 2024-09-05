import express from "express";
import {
	createProduct,
	getAllProduct,
	getProduct,
	updateProduct,
	deleteProduct,
	getProductTotalCount,
} from "../controllers/productController.js";

const productRouter = express();

productRouter.route("/").get(getAllProduct);

productRouter.route("/counts").get(getProductTotalCount);

productRouter.route("/:id").get(getProduct);

productRouter.route("/").post(createProduct);

productRouter.route("/:id").put(updateProduct);
productRouter.route("/:id").delete(deleteProduct);

export default productRouter;
