import express from "express";

// importing routes

import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/product.js";
import userRoute from "./routes/user.js";

const port = 4000;

connectDB();

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});
