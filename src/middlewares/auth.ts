import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

//middleware for admin only routes
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Please provide userId", 401));

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid userId", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("Cant access Admin only routes", 401));

  next();
});
