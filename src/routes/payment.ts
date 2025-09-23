import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  deleteCoupon,
  getCoupon,
  newCoupon,
  updateCoupon,
} from "../controllers/payment.js";

const app = express.Router();

app.post("/coupon/new", adminOnly, newCoupon);

app.get("/discount", applyDiscount);

app.get("/coupon/all", allCoupons);

app.route("/coupon/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

export default app;
