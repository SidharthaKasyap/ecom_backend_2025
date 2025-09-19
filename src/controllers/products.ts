import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category, description } = req.body;

    const photo = req.file;
    //as Express.Multer.File[] | undefined;

    console.log(photo, "photo");

    if (!photo) return next(new ErrorHandler("Please add Photo", 400));
    // if (photos.length < 1)
    //   return next(new ErrorHandler("Please add atleast one Photo", 400));

    // if (photos.length > 5)
    //   return next(new ErrorHandler("You can only upload 5 Photos", 400));

    if (!name || !price || !stock || !category)
      return next(new ErrorHandler("Please enter All Fields", 400));

    await Product.create({
      name,
      price,
      description,
      stock,
      category: category.toLowerCase(),
      photos: photo?.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);
