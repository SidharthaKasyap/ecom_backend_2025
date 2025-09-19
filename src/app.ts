import express from "express";

const port = 4000;

connectDB();
// importing routes

import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});
