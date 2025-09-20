import express from "express";

import {
  deleteSingleProduct,
  getAdminProducts,
  getAllCategories,
  getlatestProducts,
  getSingleProduct,
  newProduct,
  searchAllProduct,
  updateProduct,
} from "../controllers/products.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct);

app.get("/search", searchAllProduct);

app.get("/latest", getlatestProducts);

app.get("/categories", getAllCategories);

app.get("/admin-products", getAdminProducts);

app
  .route("/:id")
  .get(getSingleProduct)
  .put(singleUpload, updateProduct)
  .delete(deleteSingleProduct);

export default app;
