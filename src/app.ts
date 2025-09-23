import express from "express";
import { config } from "dotenv";
import morgan from "morgan";

// importing routes

import { connectDB } from "./utils/features.js";
import NodeCache from "node-cache";
import { errorMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import userRoute from "./routes/user.js";
import paymentRoute from "./routes/payment.js";
import statsRoute from "./routes/stats.js";

config({
  path: "./.env",
});
const port = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URL!);

export const myCache = new NodeCache();

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", statsRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});
