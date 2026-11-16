import { Request, Response } from "express";

import { statusCodes } from "@/constants/statusCodes";
import { Category } from "@/models/category-model";
import { catchAsync } from "@/utils/catch-async";

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  try {
    const { name, image, slug } = req.body;
    const category = await Category.create({ name, image, slug });
    res.status(statusCodes.CREATED).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error creating category",
      error,
    });
  }
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(statusCodes.OK).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error updating category",
      error,
    });
  }
});

export const getCategory = catchAsync(async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(statusCodes.OK).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error retrieving categories",
      error,
    });
  }
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Category ID is required",
      });
    }
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(statusCodes.OK).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error deleting category",
      error,
    });
  }
});
