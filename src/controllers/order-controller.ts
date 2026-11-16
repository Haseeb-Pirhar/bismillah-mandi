import { Request, Response } from "express";

import { statusCodes } from "@/constants";
import { Cart, Order } from "@/models";
import { catchAsync } from "@/utils";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  try {
    const {
      guestId,
      customerName,
      contactNumber,
      deliveryAddress,
      paymentMethod = "COD",
    } = req.body;

    if (!guestId) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    const cart = await Cart.findOne({ guestId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalPrice = 0;

    const items = cart.items.map((item: any) => {
      const product = item.product;

      totalPrice += product.price * item.quantity;

      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await Order.create({
      guestId,
      customerName,
      contactNumber,
      deliveryAddress,
      paymentMethod,
      items,
      totalPrice,
    });

    await Cart.findOneAndDelete({ guestId });

    res.status(statusCodes.CREATED).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error: Error | any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error creating order",
      error,
    });
  }
});
