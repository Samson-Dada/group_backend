import express from "express";
import config from "./config.js";
import dbConnection from "./db/dbConnection.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/productRoute.js";
import UserRoute from "./routes/userRoute.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

//Routes
app.use("/api/auth", authRouter);

app.use("/api/products", productRouter);

app.use("/api/users", UserRoute);

app.use("/uploads", express.static("uploads"));
dbConnection();
app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});
