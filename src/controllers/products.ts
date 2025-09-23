import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { de, faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

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

    await invalidateCache({ product: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product not found", 404));
  //as Express.Multer.File[] | undefined;

  if (photo) {
    rm(product?.photo!, () => {
      console.log("old photo deleted");
    });

    product.photo = photo.path;
  }
  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category.toLowerCase();

  await product.save();

  await invalidateCache({ product: true, productId: id });

  return res.status(200).json({
    success: true,
    message: "Product updated Successfully",
  });
});

export const deleteSingleProduct = TryCatch(async (req, res, next) => {
  let product;

  const { id } = req.params;
  product = await Product.findById({ id });

  if (!product) return next(new ErrorHandler("Product not found", 404));

  rm(product?.photo!, () => {
    console.log("product photo deleted");
  });

  await product.deleteOne();

  await invalidateCache({ product: true, productId: id });

  return res.status(200).json({
    success: true,
    product,
  });
});

export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;

  // products = await redis.get("latest-products");

  // if (products) products = JSON.parse(products);
  // else {

  //   await redis.setex("latest-products", redisTTL, JSON.stringify(products));
  // }

  if (myCache.has("latest-products")) {
    products = JSON.parse(myCache.get("latest-products")!);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories")) {
    categories = JSON.parse(myCache.get("all-categories")!);
  } else {
    categories = await Product.distinct("category");

    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("all-products")) {
    products = JSON.parse(myCache.get("all-products")!);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 });
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;

  const { id } = req.params;

  if (myCache.has(`product-${id}`)) {
    product = JSON.parse(myCache.get(`product-${id}`)!);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const searchAllProduct = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, category, sort, price } = req.query;

    const pages = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCTS_PER_PAGE) || 8;

    const skip = limit! * (pages - 1);

    const baseQuery: BaseQuery = {};

    if (search) baseQuery.name = { $regex: search, $options: "i" };
    if (category) baseQuery.category = category;
    if (price) baseQuery.price = { $lte: Number(price) };

    const [products, filteredOnlyProduct] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      Product.find(baseQuery),
    ]);

    const totalProducts = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalProducts,
    });
  }
);
//
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\x066d1c4ce3-de4b-4640-b7de-d73b717d2e85.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

//generateRandomProducts(50);
//deleteRandomsProducts(48);
