import { Request, Response } from "express";

import { statusCodes } from "@/constants";
import { Cart } from "@/models";
import { catchAsync } from "@/utils";

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  try {
    const { guestId, productId, quantity = 1 } = req.body;

    if (!guestId || !productId) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "guestId and productId are required",
      });
    }

    let cart = await Cart.findOne({ guestId });

    if (!cart) {
      cart = await Cart.create({
        guestId,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({
          product: productId,
          quantity,
        });
      }

      await cart.save();
    }

    res.status(statusCodes.OK).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to add product to cart",
      error,
    });
  }
});

export const getCart = catchAsync(async (req: Request, res: Response) => {
  try {
    const { guestId } = req.params;
    if (!guestId) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "guestId is required",
      });
    }

    const cart = await Cart.findOne({ guestId }).populate("items.product");
    if (!cart) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(statusCodes.OK).json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to retrieve cart",
      error,
    });
  }
});

export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  try {
    const { guestId } = req.params;
    const { productId, quantity } = req.body;
    if (!guestId || !productId || quantity === undefined) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "guestId, productId and quantity are required",
      });
    }

    const cart = await Cart.findOne({ guestId });
    if (!cart) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(statusCodes.OK).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update cart item",
      error,
    });
  }
});

export const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  try {
    const { guestId } = req.params;
    const { productId } = req.body;
    if (!guestId || !productId) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "guestId and productId are required",
      });
    }

    const cart = await Cart.findOne({ guestId });
    if (!cart) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item: { product: { toString: () => any } }) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(statusCodes.OK).json({
      success: true,
      message: "Product removed from cart",
      data: cart,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to remove product from cart",
      error,
    });
  }
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  try {
    const { guestId } = req.params;
    if (!guestId) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "guestId is required",
      });
    }

    const cart = await Cart.findOne({ guestId });
    if (!cart) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items.splice(0);
    await cart.save();

    res.status(statusCodes.OK).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to clear cart",
      error,
    });
  }
});

export const checkoutCart = catchAsync(async (req: Request, res: Response) => {
  try {
    const { guestId } = req.params;
    if (!guestId) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "guestId is required",
      });
    }

    const cart = await Cart.findOne({ guestId }).populate("items.product");
    if (!cart) {
      return res.status(statusCodes.NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Here you would typically create an order based on the cart items
    // For simplicity, we'll just clear the cart after "checkout"
    cart.items.splice(0);
    await cart.save();
    res.status(statusCodes.OK).json({
      success: true,
      message: "Cart checked out successfully",
      data: cart,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to checkout cart",
      error,
    });
  }
});
