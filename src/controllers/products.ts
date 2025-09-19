import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { rm } from "fs";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category, description } = req.body;

    const photo = req.file;
    //as Express.Multer.File[] | undefined;

    if (!photo) return next(new ErrorHandler("Please add Photo", 400));
    // if (photos.length < 1)
    //   return next(new ErrorHandler("Please add atleast one Photo", 400));

    // if (photos.length > 5)
    //   return next(new ErrorHandler("You can only upload 5 Photos", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("deleted");
      });
      return next(new ErrorHandler("Please fill all the fields", 400));
    }

    await Product.create({
      name,
      price,
      description,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;

  // products = await redis.get("latest-products");

  // if (products) products = JSON.parse(products);
  // else {

  //   await redis.setex("latest-products", redisTTL, JSON.stringify(products));
  // }

  products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
  return res.status(200).json({
    success: true,
    products,
  });
});
