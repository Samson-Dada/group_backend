import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product must have a name"],
		unique: true,
	},
	price: {
		type: Number,
		required: [true, "Product must have a price"],
	},
	description: {
		type: String,
		required: [true, "Product must have a description"],
	},
	image: {
		type: String,
		//required: [true, "Product must have a image"],
	},
	createdBy: {
		type: String,
		required: [true],
	}, // You can also reference a User model if you have one
	createdDate: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model("Product", productSchema);
export default Product;
