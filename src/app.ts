import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import NodeCache from "node-cache";

// importing routes

import { connectDB } from "./utils/features.js";
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
const stripeKey = process.env.STRIPE_KEY || "";

connectDB(process.env.MONGODB_URL!);

export const myCache = new NodeCache();

export const stripe = new Stripe(stripeKey);

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
