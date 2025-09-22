import express from "express";

import {
  allOrder,
  deleteOrder,
  getSingleOrder,
  myOrder,
  newOrder,
  processOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", newOrder);

app.get("/my", myOrder);

app.get("/all", adminOnly, allOrder);

app.route("/:id").get(getSingleOrder).put(processOrder).delete(deleteOrder);

export default app;
