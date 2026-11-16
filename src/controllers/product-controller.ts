import { Request, Response } from "express";

import { statusCodes } from "@/constants";
import { Product } from "@/models/product-model";
import { catchAsync } from "@/utils/catch-async";

export const addProduct = catchAsync(async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user._id;
    console.log("Admin ID from token:", adminId); // Debug log
    if (!adminId) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    const {
      title,
      slug,
      description,
      buyPrice,
      myPrice,
      images,
      category,
      stock,
      isActive,
      isFeatured,
      discount,
      tags,
    } = req.body;
    console.log("Received product data:", req.body);
    if (!title || !slug || !description || myPrice === undefined || !category) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "Missing required fields" });
    }
    const newProduct = new Product({
      title,
      slug,
      description,
      buyPrice,
      myPrice,
      images,
      category,
      stock,
      isActive,
      isFeatured,
      discount,
      tags,
    });
    const savedProduct = await newProduct.save();
    res
      .status(statusCodes.CREATED)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error: Error | any) {
    console.error("Error adding product:", error); // Debug log
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to add product", error: error.message });
  }
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "Product ID is required" });
    }
    const adminId = (req as any).user._id;
    if (!adminId) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "Product not found" });
    }
    res
      .status(statusCodes.OK)
      .json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error: Error | any) {
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update product", error: error.message });
  }
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const adminId = (req as any).userId;
    if (!productId) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "Product ID is required" });
    }
    if (!adminId) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "Product not found" });
    }
    res
      .status(statusCodes.OK)
      .json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error: Error | any) {
    res

      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to delete product", error: error.message });
  }
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.status(statusCodes.OK).json({ products });
  } catch (error: Error | any) {
    res

      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});
